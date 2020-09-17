# -*- coding: utf-8 -*-

import sys
sys.path.append("/Users/teranishidaina/opt/anaconda3/envs/dialog/lib/python3.7/site-packages")
sys.path.append("/Users/teranishidaina/opt/anaconda3/envs/dialog/lib/python/site-packages")


import NLU
import datetime
from dateutil.relativedelta import relativedelta
import sys, json

data = sys.argv

weekday = {"月曜日": 0, "火曜日": 1, "水曜日": 2, "木曜日": 3, "金曜日": 4, "土曜日": 5, "日曜日": 6}
model = NLU.main()

def check(text):
    ur, da, concept = model(text)

    if da == "negative":
        return [0]
    elif not("plan" in concept):
        return [0]
    else:
       year, month, day =  date_detector(concept.get("month"),
                      concept.get("day"),
                      concept.get("youbi"),
                      concept.get("today"),
                      concept.get("tomorrow"),
                      concept.get("after_tomorrow"),
                      concept.get("next_week"),
                      concept.get("next_month"))

       if month == "0" or day == "0":
           result = [0, 0]
       else:
           d = datetime.datetime.strptime(year + "-" + month.replace("月", "") + "-" + day.replace("日", ""), "%Y-%m-%d").strftime("%Y-%m-%d")
           result = [concept["plan"], d]
       return result




def date_detector(month, day, youbi, today, tomorrow, after_tomorrow, next_week, next_month):
    dt_now = datetime.datetime.now()
    return_year = 2020
    return_month = 0
    return_day = 0

    if day != None:
        if month != None:
            return_month = month
            return_day = day
        elif next_month != None:
            dt_now = dt_now + relativedelta(months=1)
            return_month = dt_now.month
            return_day = day
        elif int(day.replace("日", "")) >= dt_now.day:
            dt_now = dt_now + datetime.timedelta(days=(int(day.replace("日", ""))-dt_now.day))
            return_month = dt_now.month
            return_day = dt_now.day
    if today != None:
        return_month = dt_now.month
        return_day = dt_now.day
    if tomorrow != None:
        dt_now = dt_now + datetime.timedelta(days=1)
        return_month = dt_now.month
        return_day = dt_now.day
    if after_tomorrow != None:
        dt_now = dt_now + datetime.timedelta(days=2)
        return_month = dt_now.month
        return_day = dt_now.day
    if youbi != None:
        if next_week != None:
            dt_now = dt_now + datetime.timedelta(days= (weekday[youbi]+7 - dt_now.weekday()))
            return_month = dt_now.month
            return_day = dt_now.day
        elif weekday[youbi] >= dt_now.weekday():
            dt_now = dt_now + datetime.timedelta(days=(weekday[youbi]-dt_now.weekday()))
            return_month = dt_now.month
            return_day = dt_now.day

    return str(return_year), str(return_month), str(return_day)


    # print(month)
    # print(day)
    # print(youbi)
    # print(today)
    # print(tomorrow)
    # print(after_tomorrow)
    # print(next_week)
    # print(next_month)

#
results = check(data[1])
for result in results:
    print(result)
# check("今日インターンシップに行こう")
# check("来週の水曜日インターンシップに行こう")
# check("明日インターンシップに行こう")
