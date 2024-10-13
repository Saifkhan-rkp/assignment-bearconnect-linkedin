from flask import Flask, request, jsonify
from py_scripts import Linkedin
from py_scripts.converts import (
    parse_messages_data,
    parse_conversations
    )
app = Flask(__name__)

# Sample data to simulate a simple database
data = [
    {"id": 1, "name": "Item 1"},
    {"id": 2, "name": "Item 2"},
]

# GET method to fetch data
@app.route('/')
def im_on():
    return jsonify({"success":True, "message":"Running..!"}), 200

# GET method to fetch data
@app.route('/api', methods=['GET'])
def get_items():
    return jsonify({"data": data}), 200


# GET method to fetch a single item by its ID (path parameter)
@app.route('/api/<string:reqId>/<string:req>', methods=['GET'])
def get_with_params(reqId,req):
    # print(username, req)
    api = Linkedin(load=reqId, load_cookie=True, debug=True)
    if req == "my_profile":
        myProfile = api.get_user_profile()
        if myProfile:
            return jsonify({"data": myProfile})
        return jsonify({"error": "Resource not found"}), 404
    
    if req == "conversations":
        convo = api.get_conversations()
        if convo:
            convos = parse_conversations(convo)
            convos["paging"] = convo.get("paging",{})
            convos["unreads"] = convo.get("metadata",{}).get("unreadCount", 0)
            return jsonify({"data": convos, "success":True})
        return jsonify({"error": "Resource not found","success":False}), 404
    
    # Acccepts query parameter ?convurn=
    if req == "conversation":
        msgurn = request.args.get('convurn')
        convo = api.get_conversation(msgurn)
        if convo:
            convo = parse_messages_data(convo)
            return jsonify({"data": convo})
        return jsonify({"error": "Resource not found"}), 404
    
    # Accepts query parameter ?publicProfile=
    if req == "user_profile":
        user_public_id = request.args.get('publicProfile')
        if not user_public_id:
            return jsonify({"error": "NO user"}), 404
        
        userProfile = api.get_profile(user_public_id)
        if userProfile:
            return jsonify({"data": userProfile})
    
    if req == "network_info":
        profileId = request.args.get('profileId')
        userProfile = api.get_profile_network_info(profileId)
        if userProfile:
            return jsonify({"data": userProfile})
        return jsonify({"error": "Resource not found"}), 404

    return jsonify({"error": f"unable to process request: {req}"}), 409
    

# POST method to add new data
@app.route('/api/<string:id>/<string:req>', methods=['POST'])
def post(id, req):
    # Get the data from the request body
    body = request.get_json()
    email = body.get("email", None)
    if email:
        api = Linkedin(body["email"], load_cookie=False, debug=True)
    else:
        api = Linkedin(load=id,load_cookie=True, debug=True, isOtpSubmission= req=="otp_submit" )
    
    # Parameter req
    if req == "login":
        print(body["email"],body["password"])
        result = api.login(body["password"], id=id)
        return jsonify({"data":result}), 201
 
    if req == "otp_submit":
        result = api.submitOTP(body["otp"], id=id)
        return jsonify({"data":result}), result.get("status", 201)
 
    if req == "send_message":
        result, status = api.send_message(body["message"], body["convoId"])
        return jsonify({"data":result}), status
    
    # Return a response with the new item and a success message
    return jsonify({"message": "Request not processed"}), 409

# DELETE method to delete data
@app.route('/items', methods=['DELETE'])
def delete():
    # Get the data from the request body
    new_item = request.get_json()
    
    # Add an ID to the new item and append it to the list
    new_item["id"] = len(data) + 1
    data.append(new_item)
    
    # Return a response with the new item and a success message
    return jsonify({"message": "Item added successfully", "item": new_item}), 201

# Error handler for invalid routes
@app.errorhandler(404)
def page_not_found(e):
    return jsonify({"error": "Resource not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)