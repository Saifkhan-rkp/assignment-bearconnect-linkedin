

def parse_messages_data(data):
    messages = []
    for event in data["elements"]:
        ment = event["eventContent"]["com.linkedin.voyager.messaging.event.MessageEvent"]
        message = {
            "createdAt": event["createdAt"],
            "reactions": event["reactionSummaries"],
            "body": event.get("eventContent",{}).get("com.linkedin.voyager.messaging.event.MessageEvent",{}).get("attributedBody", {}).get("text", ""),
            "messageBody":event.get("eventContent",{}).get("com.linkedin.voyager.messaging.event.MessageEvent",{}),
            "subject": event["subtype"],
            "postLink": None,
            "senderMemberId": event["from"]["com.linkedin.voyager.messaging.MessagingMember"]["miniProfile"]["objectUrn"].split(":")[-1],
            "messageId": event["backendUrn"].split(":")[-1],
            "messageType": 0 if event["subtype"] == "MEMBER_TO_MEMBER" else 1,
            "attachments": ment["attachments"] if "attachments" in ment else [],
            # "isInMail": event["isInMail"],
            # "sender": 1 if event["messageEventParticipantFrom"]["com.linkedin.voyager.messaging.MessagingMemberId"] == "935009199" else 0,
            # "success": True,
            # "inboxConversationId": event["messageId"]
        }

        messages.append(message)

    result = {
        "messages": messages,
        "total": len(messages),
        "isNextInMail": True
    }
    

    return result

def parse_conversations(data:dict):

    elements = data.get('elements', [])
    items = []

    for element in elements:
        if not element:
            continue 
        # Extracting last message details
        last_message_event = element.get('events', [])[-1] if element.get('events') else None
        last_message_text = ""
        last_message_sender = None
        last_message_at = None
        if last_message_event:
            last_message_text = last_message_event.get('eventContent', {}).get('com.linkedin.voyager.messaging.event.MessageEvent', {}).get('attributedBody', {}).get('text', "")
            last_message_sender = last_message_event.get('from', {}).get('com.linkedin.voyager.messaging.MessagingMember', {}).get('miniProfile',{}).get('objectUrn', '').split(':')[-1]  # Assuming sender is always the other participant
            last_message_at = last_message_event.get('createdAt', 0) 

        # Extracting participant details
        participant = element.get('participants', [])[0].get('com.linkedin.voyager.messaging.MessagingMember', {}).get('miniProfile', {})
        correspondent_member_id = participant.get('objectUrn', '').split(':')[-1]

        picture = participant.get('picture', {}).get('com.linkedin.common.VectorImage', {})
        image_url = picture
  
        
        profile_url = f"https://www.linkedin.com/in/{participant.get('publicIdentifier', '')}"
        
        last_correspondant_seen =next((r.get("seenReceipt", {}).get("seenAt", None) for r in element.get("receipts",[]) if r.get("fromParticipant", {}).get("string", "").split(':')[-1] == correspondent_member_id ), None) # Assuming default value

        # Constructing the item
        item = {
            "conversationType": 0,
            "read": element.get('read', False),
            "groupChat": element.get('groupChat', False),
            "unreadMessageCount": element.get('unreadCount', 0),
            "lastActivityAt": element.get('lastActivityAt', 0),
            "lastCorrespondentSeenAt": last_correspondant_seen,  # Assuming default value
            "lastReadAt": element.get('lastReadAt', 0),
            "archived": element.get('archived', False),
            "blockedByMe": element.get('blocked', False),
            "blockedByParticipant": False,  # Assuming default value
            "starred": element.get('starred', False),
            "nonConnection": not element.get('withNonConnection', True),
            "muted": element.get('muted', False),
            "lastMessageAt": last_message_at,
            "lastMessageText": last_message_text,
            "lastMessageSuccess": True,  # Assuming the message was successfully sent
            "lastMessageType": 0,  # Assuming default message type
            "lastMessageSender": 1 if last_message_sender==correspondent_member_id else 0,
            "correspondentMemberId": correspondent_member_id,
            "correspondentProfile": {
                "id": correspondent_member_id,
                "imageUrl": image_url,
                "firstName": participant.get('firstName', ''),
                "lastName": participant.get('lastName', ''),
                "username": participant.get('publicIdentifier', ''),
                "summary": participant.get('occupation', ''),
                "connections": 0,
                "followers": 0,
                "profileId": participant.get('entityUrn', '').split(':')[-1],
                "fullName": f"{participant.get('firstName', '')} {participant.get('lastName', '')}",
                "profileUrl": profile_url
            },
            "id": element.get('entityUrn', '').split(':')[-1]
        }

        items.append(item)

    return {"items": items}

