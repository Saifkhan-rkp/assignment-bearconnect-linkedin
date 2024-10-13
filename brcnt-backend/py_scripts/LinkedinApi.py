import random
import json
import uuid
import logging
from time import sleep
from operator import itemgetter
from typing import Dict, Union, Optional, List, Literal
from py_scripts.client import Client
from py_scripts.cookie_repo import CookieRepository
from py_scripts.utils.helpers import (
    get_id_from_urn,
    generate_trackingId_as_charString
)

logger = logging.getLogger(__name__)

def default_evade():
    """
    A catch-all method to try and evade suspension from Linkedin.
    Currenly, just delays the request by a random (bounded) time
    """
    sleep(random.randint(2, 5))  # sleep a random duration to try and evade suspention

class Linkedin(object):
    def __init__(self, email:str="", *, password:str = "", load:str="",load_cookie=False, proxis={}, debug=False, isOtpSubmission=False, cookies_dir:str ="") -> None:
        self.username = email
        self.password = password
        self.load = load
        if isOtpSubmission and load_cookie:
            self.client = Client(proxis=proxis, load_cookies=True, cookieName=load)
        else:
            self.client = Client(proxis=proxis)

        logging.basicConfig(level=logging.DEBUG if debug else logging.INFO)
        self.logger = logger

        if load_cookie:
            # self.client._set_session_cookies(CookieRepository().get(username=self.username))
            self.client.loadCookies(self.load)
        # else:
        #     resp = self.client.login(self.username, self.password)
        #     self.logger.info(f"Login debug: {resp}")
    
    def login(self, password=None, id:str=""):
        pswd = password or self.password
        if not pswd:
            return {"message":"password not provided"}
        res = self.client.login(self.username, pswd, id)
        return {"isLoggedIn":res=="loggedin", "isOtpSent":res=="otp_sent"}

    def submitOTP(self, otp, id=""):
        res = self.client.submitOTP(otp, id=id)
        return res

    def set_session_cookie(self):
        self.client._set_session_cookies(CookieRepository().get(self.load))
        
    def _fetch(self, uri: str, evade=default_evade, base_request=False, **kwargs):
        """GET request to Linkedin API"""
        # evade()

        url = f"{self.client.API_BASE_URL if not base_request else self.client.LINKEDIN_BASE_URL}{uri}"
        return self.client.session.get(url, **kwargs)

    def _post(self, uri: str, evade=default_evade, base_request=False, **kwargs):
        """POST request to Linkedin API"""
        # evade() # evade time removed while requesting

        url = f"{self.client.API_BASE_URL if not base_request else self.client.LINKEDIN_BASE_URL}{uri}"
        return self.client.session.post(url, **kwargs)

    
    def get_user_profile(self, use_cache=True) -> Dict:
        """Get the current user profile. If not cached, a network request will be fired.

        :return: Profile data for currently logged in user
        :rtype: dict
        """
        # me_profile = self.client.metadata.get("me", {})
        me_profile = self.client.metadata.get("me", {})
        if not self.client.metadata.get("me") or not use_cache:
            res = self._fetch(f"/me")
            me_profile = res.json()
            # cache profile
            self.client.metadata["me"] = me_profile

        return me_profile
    
    def get_profile(
        self, public_id: Optional[str] = None, urn_id: Optional[str] = None
    ) -> Dict:
        """Fetch data for a given LinkedIn profile.

        :param public_id: LinkedIn public ID for a profile
        :type public_id: str, optional
        :param urn_id: LinkedIn URN ID for a profile
        :type urn_id: str, optional

        :return: Profile data
        :rtype: dict
        """
        # NOTE this still works for now, but will probably eventually have to be converted to
        # https://www.linkedin.com/voyager/api/identity/profiles/ACoAAAKT9JQBsH7LwKaE9Myay9WcX8OVGuDq9Uw
        res = self._fetch(f"/identity/profiles/{public_id or urn_id}/profileView")

        data = res.json()
        if data and "status" in data and data["status"] != 200:
            self.logger.info("request failed: {}".format(data["message"]))
            return {}

        # massage [profile] data
        profile = data["profile"]
        if "miniProfile" in profile:
            if "picture" in profile["miniProfile"]:
                profile["displayPictureUrl"] = profile["miniProfile"]["picture"][
                    "com.linkedin.common.VectorImage"
                ]["rootUrl"]

                images_data = profile["miniProfile"]["picture"][
                    "com.linkedin.common.VectorImage"
                ]["artifacts"]
                for img in images_data:
                    w, h, url_segment = itemgetter(
                        "width", "height", "fileIdentifyingUrlPathSegment"
                    )(img)
                    profile[f"img_{w}_{h}"] = url_segment

            profile["profile_id"] = get_id_from_urn(profile["miniProfile"]["entityUrn"])
            profile["profile_urn"] = profile["miniProfile"]["entityUrn"]
            profile["member_urn"] = profile["miniProfile"]["objectUrn"]
            profile["public_id"] = profile["miniProfile"]["publicIdentifier"]

            del profile["miniProfile"]

        del profile["defaultLocale"]
        del profile["supportedLocales"]
        del profile["versionTag"]
        del profile["showEducationOnProfileTopCard"]

        # massage [experience] data
        experience = data["positionView"]["elements"]
        for item in experience:
            if "company" in item and "miniCompany" in item["company"]:
                if "logo" in item["company"]["miniCompany"]:
                    logo = item["company"]["miniCompany"]["logo"].get(
                        "com.linkedin.common.VectorImage"
                    )
                    if logo:
                        item["companyLogoUrl"] = logo["rootUrl"]
                del item["company"]["miniCompany"]

        profile["experience"] = experience

        # massage [education] data
        education = data["educationView"]["elements"]
        for item in education:
            if "school" in item:
                if "logo" in item["school"]:
                    item["school"]["logoUrl"] = item["school"]["logo"][
                        "com.linkedin.common.VectorImage"
                    ]["rootUrl"]
                    del item["school"]["logo"]

        profile["education"] = education

        # massage [languages] data
        languages = data["languageView"]["elements"]
        for item in languages:
            del item["entityUrn"]
        profile["languages"] = languages

        # massage [publications] data
        publications = data["publicationView"]["elements"]
        for item in publications:
            del item["entityUrn"]
            for author in item.get("authors", []):
                del author["entityUrn"]
        profile["publications"] = publications

        # massage [certifications] data
        certifications = data["certificationView"]["elements"]
        for item in certifications:
            del item["entityUrn"]
        profile["certifications"] = certifications

        # massage [volunteer] data
        volunteer = data["volunteerExperienceView"]["elements"]
        for item in volunteer:
            del item["entityUrn"]
        profile["volunteer"] = volunteer

        # massage [honors] data
        honors = data["honorView"]["elements"]
        for item in honors:
            del item["entityUrn"]
        profile["honors"] = honors

        # massage [projects] data
        projects = data["projectView"]["elements"]
        for item in projects:
            del item["entityUrn"]
        profile["projects"] = projects
        # massage [skills] data
        skills = data["skillView"]["elements"]
        for item in skills:
            del item["entityUrn"]
        profile["skills"] = skills

        profile["urn_id"] = profile["entityUrn"].replace("urn:li:fs_profile:", "")

        return profile

    def get_conversations(self):
        """Fetch list of conversations the user is in.

        :return: List of conversations
        :rtype: list
        """
        params = {"keyVersion": "LEGACY_INBOX"}

        res = self._fetch(f"/messaging/conversations", params=params)

        return res.json()

    def mark_conversation_as_seen(self, conversation_urn_id: str):
        """Send 'seen' to a given conversation.

            :param conversation_urn_id: LinkedIn URN ID for a conversation
            :type conversation_urn_id: str

            :return: Error state. If True, an error occured.
            :rtype: boolean
        """
        payload = json.dumps({"patch": {"$set": {"read": True}}})

        res = self._post(
                f"/messaging/conversations/{conversation_urn_id}", data=payload
        )

        return res.status_code != 200
    
    def get_conversation(self, conversation_urn_id: str):
        """Fetch data about a given conversation.

        :param conversation_urn_id: LinkedIn URN ID for a conversation
        :type conversation_urn_id: str

        :return: Conversation data
        :rtype: dict
        """
        res = self._fetch(f"/messaging/conversations/{conversation_urn_id}/events")

        return res.json()
    
    def send_message(
        self,
        message_body: str,
        conversation_urn_id: Optional[str] = None,
        recipients: Optional[List[str]] = None,
    ):
        """Send a message to a given conversation.

        :param message_body: Message text to send
        :type message_body: str
        :param conversation_urn_id: LinkedIn URN ID for a conversation
        :type conversation_urn_id: str, optional
        :param recipients: List of profile urn id's
        :type recipients: list, optional

        :return: Error state. If True, an error occured.
        :rtype: boolean
        """
        params = {"action": "create"}

        if not (conversation_urn_id or recipients):
            self.logger.debug("Must provide [conversation_urn_id] or [recipients].")
            return "missing"

        message_event = {
            "eventCreate": {
                "originToken": str(uuid.uuid4()),
                "value": {
                    "com.linkedin.voyager.messaging.create.MessageCreate": {
                        "attributedBody": {
                            "text": message_body,
                            "attributes": [],
                        },
                        "attachments": [],
                    }
                },
                "trackingId": generate_trackingId_as_charString(),
            },
            "dedupeByClientGeneratedToken": False,
        }

        if conversation_urn_id and not recipients:
            res = self._post(
                f"/messaging/conversations/{conversation_urn_id}/events",
                params=params,
                data=json.dumps(message_event),
            )
        elif recipients and not conversation_urn_id:
            message_event["recipients"] = recipients
            message_event["subtype"] = "MEMBER_TO_MEMBER"
            payload = {
                "keyVersion": "LEGACY_INBOX",
                "conversationCreate": message_event,
            }
            res = self._post(
                f"/messaging/conversations",
                params=params,
                data=json.dumps(payload),
            )

        return res.json() , res.status_code
    
    def get_profile_network_info(self, public_profile_id: str):
        """Fetch network information for a given LinkedIn profile.

        Network information includes the following:
        - number of connections
        - number of followers
        - if the account is followable
        - the network distance between the API session user and the profile
        - if the API session user is following the profile

        :param public_profile_id: public ID of a LinkedIn profile
        :type public_profile_id: str

        :return: Network data
        :rtype: dict
        """
        res = self._fetch(
            f"/identity/profiles/{public_profile_id}/networkinfo",
            headers={"accept": "application/vnd.linkedin.normalized+json+2.1"},
        )
        if res.status_code != 200:
            return {}

        data = res.json()
        return data.get("data", {})
