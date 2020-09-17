# -*- coding: utf-8 -*-

import re
import random
import json
import xml.etree.ElementTree
import numpy as np
import sys

plan = ["ご飯", "課題", "インターンシップ", "遊び", "バーベキュー", "勉強", "会議", "飲み", "誕生会",
        "釣り", "ボーリング", "ゴルフ", "バイト", "お出かけ", "デート", "学校", "教習", "カフェ"]
prefix = ["じゃあ", "だったら", "それじゃあ", "それなら", "そしたら", "つまり", "では"]
month = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"]
day = ["1日", "2日", "3日", "4日", "5日", "6日", "7日", "8日", "9日", "10日",
       "11日", "12日", "13日", "14日", "15日", "16日", "17日", "18日", "19日", "20日",
       "21日", "22日", "23日", "24日", "25日", "26日", "27日", "28日", "29日", "30日",
       "31日"]
today = ["今日", "今日の午後", "今日の昼", "今日中に", "今日までに", "本日", "本日の"]
tomorrow = ["明日", "明日の午後", "明日の昼", "明日中に", "明日までに", "明日の午前"]
after_tomorrow = ["明後日", "明後日の午後", "明後日の昼", "明後日中に", "明後日までに", "明後日の午前"]
youbi = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"]
next_week = ["来週の", "次の週の", "次の"]
next_month = ["来月の", "次の月の", "次の"]

#

# サンプル文に含まれる単語を置き換えることで学習用事例を作成
def random_generate(da, root):
    buf = ""
    # タグがない文章の場合は置き換えしないでそのまま返す
    if len(root) == 0:
        return root.text
    # タグで囲まれた箇所を同じ種類の単語で置き換える
    for elem in root:
        if elem.tag == "plan":
            pref = str(random.choice(plan))
            buf += pref
        elif elem.tag == "prefix":
            pref = str(random.choice(prefix))
            buf += pref
        elif elem.tag == "day":
            pref = str(random.choice(day))
            buf += pref
        elif elem.tag == "month":
            pref = str(random.choice(month))
            buf += pref
        elif elem.tag == "today":
            pref = str(random.choice(today))
            buf += pref
        elif elem.tag == "tomorrow":
            pref = str(random.choice(tomorrow))
            buf += pref
        elif elem.tag == "after_tomorrow":
            pref = str(random.choice(after_tomorrow))
            buf += pref
        elif elem.tag == "youbi":
            pref = str(random.choice(youbi))
            buf += pref
        elif elem.tag == "nextweek":
            pref = str(random.choice(next_week))
            buf += pref
        elif elem.tag == "nextmonth":
            pref = str(random.choice(next_month))
            buf += pref
        if elem.tail is not None:
            buf += elem.tail
    return buf

# 学習用ファイルの書き出し先
fp = open("../data/da_samples.dat", "w")

da = ''
# examples.txt ファイルの読み込み
for line in open("../data/da_sample.txt", "r"):
    line = line.rstrip()
    # da= から始まる行から対話行為タイプを取得
    if re.search(r'^da=', line):
        da = line.replace('da=', '')
    # 空行は無視
    elif line == "":
        pass
    else:
        # タグの部分を取得するため，周囲にダミーのタグをつけて解析
        root = xml.etree.ElementTree.fromstring("<dummy>"+line+"</dummy>")
        # 各サンプル文を50倍に増やす
        for i in range(50):
            sample = random_generate(da, root)
            # 対話行為タイプ，発話文，タグとその文字位置を学習用ファイルに書き出す
            fp.write(da + "\t" + sample + "\n")

fp.close()