# -*- coding: utf-8 -*-

import MeCab
import re
import random
import json
import xml.etree.ElementTree
import numpy as np

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


# サンプル文に含まれる単語を置き換えることで学習用事例を作成
def random_generate(da, root):
    buf = ""
    pos = 0
    posdic = {}
    # タグがない文章の場合は置き換えしないでそのまま返す
    if len(root) == 0:
        return root.text, posdic
    # タグで囲まれた箇所を同じ種類の単語で置き換える
    for elem in root:
        if elem.tag == "plan":
            temp = random.choice(plan)
            buf += temp
            posdic["plan"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "prefix":
            temp = random.choice(prefix)
            buf += temp
            posdic["prefix"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "day":
            temp = random.choice(day)
            buf += temp
            posdic["day"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "month":
            temp = random.choice(month)
            buf += temp
            posdic["month"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "today":
            temp = random.choice(today)
            buf += temp
            posdic["today"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "tomorrow":
            temp = random.choice(tomorrow)
            buf += temp
            posdic["tomorrow"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "after_tomorrow":
            temp = random.choice(after_tomorrow)
            buf += temp
            posdic["after_tomorrow"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "youbi":
            temp = random.choice(youbi)
            buf += temp
            posdic["youbi"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "nextweek":
            temp = random.choice(next_week)
            buf += temp
            posdic["next_week"] = (pos, pos + len(temp))
            pos += len(temp)

        elif elem.tag == "nextmonth":
            temp = random.choice(next_month)
            buf += temp
            posdic["next_month"] = (pos, pos + len(temp))
            pos += len(temp)

        if elem.tail is not None:
            buf += elem.tail
            pos += len(elem.tail)
    return buf, posdic


# 現在の文字位置に対応するタグをposdicから取得
def get_label(pos, posdic):
    for label, (start, end) in posdic.items():
        if start <= pos and pos < end:
            return label
    return "O"


# MeCabの初期化
mecab = MeCab.Tagger()
mecab.parse('')

# 学習用ファイルの書き出し先
fp = open("../data/concept_samples.dat", "w")

da = ''
# eamples.txt ファイルの読み込み
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
        root = xml.etree.ElementTree.fromstring("<dummy>" + line + "</dummy>")
        # 各サンプル文を25倍に増やす
        for i in range(50):
            sample, posdic = random_generate(da, root)

            # lis は[単語，品詞，ラベル]のリスト
            lis = []
            pos = 0
            prev_label = ""
            for line in mecab.parse(sample).splitlines():
                if line == "EOS":
                    break
                else:
                    word, feature_str = line.split("\t")
                    features = feature_str.split(',')
                    # 形態素情報の0番目が品詞
                    postag = features[0]

                    if "人名" in features:
                        postag = "人名"
                    elif "地域" in features:
                        postag = "地域"

                    # 現在の文字位置に対応するタグを取得
                    label = get_label(pos, posdic)
                    # label がOでなく，直前のラベルと同じであればラベルに'I-'をつける
                    if label == "O":
                        lis.append([word, postag, "O"])
                    elif label == prev_label:
                        lis.append([word, postag, "I-" + label])
                    else:
                        lis.append([word, postag, "B-" + label])
                    pos += len(word)
                    prev_label = label

            # 単語，品詞，ラベルを学習用ファイルに書き出す
            for word, postag, label in lis:
                fp.write(word + "\t" + postag + "\t" + label + "\n")
            fp.write("\n")

fp.close()
