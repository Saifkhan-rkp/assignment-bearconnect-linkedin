
# Linkedin Message Integration 
Task to integrate linkedin messsages chatbox to personal website, task by bearconnect.

## how to run
There are two folders for frontend and backend, open both folders setup env variables and do following:

### frontend
Frontend built using vite-react, for state management redux is used.

```bash
    pnpm install
    pnpm run dev
```
available routes are
* /login
* /app/linkedin-accounts 
* /app/inbox 

### backend
backend built using nodejs as well as python. were node sever is dependant on python server for linkedin related operations

* Nodejs API server
```bash
    npm install
    npm run dev
```
* Python - linkedin operation server
```bash
    python -m venv livenv
    livenv\Scripts\activate.bat # activating venv for windows,
    pip install -r requirements.txt 
    python li_server.py
```
Node api routes are 
* /api/auth/signup 
  ```js
  method: POST 
  body: {email, password, name}
  ```
* /api/auth/login
  ```js
  method: POST 
  body: {email, password }
  ```
* /api/account/add 
  ```js
  method: POST 
  body: {email, password }
  responseLoggedIn:{ success:Boolean, is data: Object(acc), message: "Linked_accounts Document is created" }
  responseOTPsent:{success: true, isOtpSent: true, id: ObjectId, email:String}
  ```
* /api/account/submit-otp 
  ```js
  method: POST 
  body: {email, otp, id }
  response:{success: Boolean, data: Object(account), message: String}
  ```
* /api/account/connected-accounts GET

* /api/utils/getConversations
```js
method:GET
response:{ success: Boolean, 
    data: { 
        convs:Array, 
        paging:Object, 
        errors:Object, 
        unreads:Number 
    } 
}
```
* /api/utils/getConversation/:id?conv= GET
```js
  method:GET
  response:{success:Boolean, data:{messages:Array}}
```
* /api/utils/:id/sendMessage
  ```js
  method: POST 
  body: { messageId, message }
  response:{success:Boolean, value:Object, message:String}
  ```

### features
 * can login multiple linkedin account
 * get convrsations for all connected accounts
 * get messages for selected conversatoin
 * can send messages to selected conversation

### need modification
 * lacks excess modification to login linked account and error handling
 * filter conversation by(unread, account, tags)  
 * random proxis setup country wise for linkedin APIs 
 * reduce evade time in python server for faster response
 
### deployment
when deploying to server (AWS, Azure, etc), proxy feature must be developed or else linkedin login will may get error.
> suggestion: Add proxyServerCountry in linked_accounts schema integrate proxy feature while requesting to python server pass the proxy detail or else pass proxyServerCountry with request integrate proxy feature in python server.
