import http.cookiejar as cookielib
import os
import time
import json
import urllib
import pickle
import logging
import urllib.request
import requests.cookies as reqcookies
from typing import Optional
from requests.sessions import Session
from http.cookies import SimpleCookie
from bs4 import BeautifulSoup, Tag
from py_scripts.cookie_repo import CookieRepository
from py_scripts.settings import OTP_DUMP_PATH

cookie_filename = "cookie-store/parser.cookies.txt"
logger = logging.getLogger(__name__)

class Client(object):

    LINKEDIN_BASE_URL = "https://www.linkedin.com"
    API_BASE_URL = f"{LINKEDIN_BASE_URL}/voyager/api"
    REQUEST_HEADERS = {
        "user-agent": " ".join(
            [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
            ]
        ),
        # "accept": "application/vnd.linkedin.normalized+json+2.1",
        "accept-language": "en-US",
        "x-li-lang": "en_US",
        "x-restli-protocol-version": "2.0.0",
        "sec-ch-ua-platform":"Windows",
        "sec-ch-ua-mobile":"?0",
        "Origin":"https://www.linkedin.com"
        # "x-li-track": '{"clientVersion":"1.2.6216","osName":"web","timezoneOffset":10,"deviceFormFactor":"DESKTOP","mpName":"voyager-web"}',
    }

    def __init__(self, *, proxis={}, cookieName:Optional[str]= None, load_cookies=False):
        
        # Simulate browser with cookies enabled
        self._cj_repo = CookieRepository()
        self.session = Session()
        self.session.proxies.update(proxis)
        self.session.headers.update(Client.REQUEST_HEADERS)
        self.metadata = {}
        self.logger = logger
        self.cj= reqcookies.RequestsCookieJar()
        if cookieName and load_cookies:
            self.cj.update(self._cj_repo.get(cookieName) or reqcookies.RequestsCookieJar())
        
        self.opener = urllib.request.build_opener(
            urllib.request.HTTPRedirectHandler(),
            urllib.request.HTTPHandler(debuglevel=0),
            urllib.request.HTTPSHandler(debuglevel=0),
            urllib.request.HTTPCookieProcessor(self.cj)
        )
        self.opener.addheaders = [
            ('User-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'),
            ("sec-ch-ua-platform", "Windows"),
            ("sec-ch-ua-mobile", "?0"),
            ("X-User-Language", "en"),
            ("X-User-Locale", "en_US"),
            ("Accept-Language", "en-us"),
            ("Origin","https://www.linkedin.com")
        ]
    
    def loadCookies(self, username:str):
        jar = self._cj_repo.get(username=username)
        self.cj.update(jar)
        self._set_session_cookies(jar)
        # self._fetch_metadata()

    def loadPage(self, url, data=None):
        """
        Utility function to load HTML from URLs for us with hack to continue despite 404
        """
        # We'll print the url in case of infinite loop
        # print "Loading URL: %s" % url
        try:
            if data is not None:
                response = self.opener.open(url, data)
                # response = self.opener
            else:
                response = self.opener.open(url)
            content = ''.join([str(l) for l in response.readlines()])
            
            # print("Page loaded: %s \n Content: %s \n" % (url, content))
            if content.__len__()>0:
                self.logger.info("Page Loaded :{}".format(url))
            return response, content
        except Exception as e:
            # If URL doesn't load for ANY reason, try again...
            # Quick and dirty solution for 404 returns because of network problems
            # However, this could infinite loop if there's an actual problem
            self.logger.info("Exception on {} load: {}".format(url, e))
            return response, None
            # return self.loadPage(url, data)

    def loadSoup(self, url, data=None):
        """
        Combine loading of URL, HTML, and parsing with BeautifulSoup
        """
        _, html = self.loadPage(url, data)
        soup = BeautifulSoup(html, "html.parser")
        return soup

    def login(self, username, password:str, id:str):
        """
        Handle login. This should populate our cookie jar.
        """
        soup = self.loadSoup("https://www.linkedin.com/login")
        loginCsrfParam = soup.find("input", {"name": "loginCsrfParam"})['value']
        csrfToken = soup.find("input", {"name": "csrfToken"})['value']
        sIdString = soup.find("input", {"name": "sIdString"})['value']

        login_data = urllib.parse.urlencode({
            'session_key': username,
            'session_password': password,
            'loginCsrfParam': loginCsrfParam,
            'csrfToken': csrfToken,
            'sIdString': sIdString
        }).encode('utf8')

        _, content = self.loadPage("https://www.linkedin.com/checkpoint/lg/login-submit", login_data)
        
        # Check for OTP page
        if "verification code" in content.lower():
            # print("OTP required. Waiting for user input...")
            self.logger.info("otp sent for login - {}".format(username))
            self.logger.info("before dumping OTP FILE - {}".format(id))
            self._cj_repo.save(self.cj, id)
            self.dumpOTPContent(content, id)
            # otp = input("Enter the OTP sent to your registered device: ")
            # self.submitOTP(otp, content)
            return "otp_sent"
        elif "feed" in content:
            self.logger.debug("Getting into Feed after submitting email and password")
            self._set_session_cookies(self.cj)
            self._cj_repo.save(self.cj, id)
            self._fetch_metadata()
            # self.logger.info("otp  - {}".format(username))
            return "loggedin"
        else:
            self._set_session_cookies(self.cj)
            self._cj_repo.save(self.cj, id)
            self._fetch_metadata()
            # self.logger.info("otp sent for login - {}".format(username))
            return "loggedin"
        

    def submitOTP(self, otp, id:str):
        """
        Handle the OTP submission.
        """
        content = self.loadOTPContent(id)
        # self._set_session_cookies(self._cj_repo.get(id))
        # self.opener.add_handler()
        if content:
            soup = BeautifulSoup(content, "html.parser")
            self.logger.info("Sipping Soup") 
        else:
            self.logger.info("OTP HTML Content Not Found") 
            return False

        otp_data = urllib.parse.urlencode({
        'csrfToken': soup.find('input', {'name': 'csrfToken'})['value'],
        'pageInstance': soup.find('input', {'name': 'pageInstance'})['value'],
        'resendUrl': soup.find('input', {'name': 'resendUrl'})['value'],
        'challengeId': soup.find('input', {'name': 'challengeId'})['value'],
        'language': 'en-US',
        'displayTime': soup.find('input', {'name': 'displayTime'})['value'],
        'challengeSource': soup.find('input', {'name': 'challengeSource'})['value'],
        'requestSubmissionId': soup.find('input', {'name': 'requestSubmissionId'})['value'],
        'challengeType': soup.find('input', {'name': 'challengeType'})['value'],
        'challengeData': soup.find('input', {'name': 'challengeData'})['value'],
        'challengeDetails': soup.find('input', {'name': 'challengeDetails'})['value'],
        'failureRedirectUri': soup.find('input', {'name': 'failureRedirectUri'})['value'],
        'pin': otp
        }).encode('utf8')

        # print(otp_data)
        # Submit OTP and complete login
        res, cont = self.loadPage("https://www.linkedin.com/checkpoint/challenge/verify", otp_data)
        
        dumpfile = self._getOTPDumpFilePath(id)
        if os.path.isfile(dumpfile) or os.path.islink(dumpfile):
            os.remove(dumpfile)
            
        if cont and "feed" in cont.lower():
            #Login successful after OTP verification
            # self._fetch_metadata()
            self._cj_repo.save(self.cj, id)
            return {"success":True, "status": res.getcode()}
        
        return {"success":False, "status": res.getcode() or 403}

    def loadTitle(self):
        soup = self.loadSoup("https://www.linkedin.com/feed/")
        return soup.find("title")
    
    def dumpOTPContent(self, content, username:str):
        if not os.path.exists(OTP_DUMP_PATH):
            os.makedirs(OTP_DUMP_PATH)

        dumpfile= self._getOTPDumpFilePath(username)
        
        self.logger.debug("OTP dump file Path: {}".format(dumpfile))

        with open(dumpfile, "wb") as f:
            pickle.dump(content, f)
    
    def loadOTPContent(self,username):
        dumpfile = self._getOTPDumpFilePath(username)
        self.logger.debug("OTP dump file Path: {}".format(dumpfile))
        try:
            with open(dumpfile, "rb") as f:
                content = pickle.load(f)
                return content
        except FileNotFoundError:
            return None
    
    def _fetch_metadata(self):
        """
        Get metadata about the "instance" of the LinkedIn application for the signed in user.

        Store this data in self.metadata
        """
        _, content = self.loadPage(f"{Client.LINKEDIN_BASE_URL}")

        soup = BeautifulSoup(content, "lxml")

        clientApplicationInstanceRaw = soup.find(
            "meta", attrs={"name": "applicationInstance"}
        )
        if clientApplicationInstanceRaw and isinstance(
            clientApplicationInstanceRaw, Tag
        ):
            clientApplicationInstanceRaw = clientApplicationInstanceRaw.attrs.get(
                "content", {}
            )
            clientApplicationInstance = json.loads(clientApplicationInstanceRaw)
            self.metadata["clientApplicationInstance"] = clientApplicationInstance

        clientPageInstanceIdRaw = soup.find(
            "meta", attrs={"name": "clientPageInstanceId"}
        )
        if clientPageInstanceIdRaw and isinstance(clientPageInstanceIdRaw, Tag):
            clientPageInstanceId = clientPageInstanceIdRaw.attrs.get("content", {})
            self.metadata["clientPageInstanceId"] = clientPageInstanceId

    def _set_session_cookies(self, cookies: cookielib.CookieJar):
        """
        Set cookies of the current session and save them to a file named as the username.
        """
        self.session.cookies = cookies
        self.session.headers["csrf-token"] = self.session.cookies["JSESSIONID"].strip(
            '"'
        )
    def cookiesToJar(self, cookies):
        """
        Save cookies from the CookieJar to a file in JSON format.
        """
        jar = reqcookies.RequestsCookieJar()
        for cookie in cookies:
            simpleCookie = SimpleCookie(cookie)
            for key, morsel in simpleCookie.items():
                if morsel["expires"]:
                    try:
                        exp = time.strptime(morsel["expires"], '%a, %d %b %Y %H:%M:%S GMT')
                        morsel["expires"] = time.strftime('%a, %d-%b-%Y %H:%M:%S GMT', exp)
                    except Exception as e:
                        continue
            jar.update(simpleCookie)
        
        return jar
    def _getOTPDumpFilePath(self, filename:str):
        return "{}{}.txt".format(OTP_DUMP_PATH, filename)
