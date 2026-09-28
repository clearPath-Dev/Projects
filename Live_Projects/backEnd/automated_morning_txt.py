from credentials import mobile_number
import requests
import schedule
import time

def send_message():
    resp = requests.post('https://textbelt.com/text', {
        'phone' : mobile_number,
        'message' : 'Good Morning',
        'key' : 'textbelt'
    })
    print(resp.json())

#set schedule to every day at ('05:00')
schedule.every(10).seconds.do(send_message)

while True:
    schedule.run_pending()
    time.sleep(1)
