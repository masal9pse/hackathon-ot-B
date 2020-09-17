# -*- coding: utf-8 -*-

import MeCab
import dill
from train.crf_util import sent2features
import re

# MeCabの初期化
mecab = MeCab.Tagger()
mecab.parse('')

# CRFモデルの読み込み
with open("../model/crf.model", "rb") as f:
    crf = dill.load(f)


# 発話文からコンセプトを抽出
def extract_concept(utt):
    lis = []
    for line in mecab.parse(utt).splitlines():
        if line == "EOS":
            break
        else:
            word, feature_str = line.split("\t")
            features = feature_str.split(',')
            if "人名" in features:
                postag = "人名"
            elif "地域" in features:
                postag = "地域"
            else:
                postag = features[0]
            lis.append([word, postag, "O"])

    words = [x[0] for x in lis]
    X = [sent2features(s) for s in [lis]]

    # 各単語に対応するラベル列
    labels = crf.predict(X)[0]

    # 単語列とラベル系列の対応を取って辞書に変換
    conceptdic = {}
    buf = ""
    last_label = ""
    for word, label in zip(words, labels):
        if re.search(r'^B-', label):
            if buf != "":
                _label = last_label.replace('B-', '').replace('I-', '')
                conceptdic[_label] = buf
            buf = word
        elif re.search(r'^I-', label):
            buf += word
        elif label == "O":
            if buf != "":
                _label = last_label.replace('B-', '').replace('I-', '')
                conceptdic[_label] = buf
                buf = ""
        last_label = label
    if buf != "":
        _label = last_label.replace('B-', '').replace('I-', '')
        conceptdic[_label] = buf

    return conceptdic


if __name__ == '__main__':
    for utt in ["9月の18日にご飯にしましょ", "月曜日はどうですか？", "日曜日にしましょう", "行きましょう",
            "粋な食べ物は何ですか", "昨日はアイスを食べました", "9月に行こう", "来週に行こう"]:
        conceptdic = extract_concept(utt)
        print(utt, conceptdic)
