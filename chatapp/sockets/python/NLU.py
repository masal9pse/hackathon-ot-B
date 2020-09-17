# -*- coding: utf-8 -*-

import MeCab
import dill
from config import Config
from train.crf_util import sent2features


import re
import logging

logger = logging.getLogger('LoggingTest')

logger.setLevel(20)
# ログをコンソール出力するための設定（2）
sh = logging.StreamHandler()
logger.addHandler(sh)

class NLU:
    def __init__(self):
        self.da_detector = self.build_svc(Config.svc_path)
        self.concept_extractor = self.build_crf(Config.crf_path)
        self.mecab = MeCab.Tagger()
        self.mecab.parse('')

    def __call__(self, utterance):
        utterance = utterance.replace("、", "")
        dialog_act = self.da_detect(utterance)
        concept = self.concept_extract(utterance)

        logger.info(utterance+":"+dialog_act)
        logger.info(concept)

        return utterance, dialog_act, concept

    def build_svc(self, svc_path):
        with open(svc_path, "rb") as f:
            vectorizer = dill.load(f)
            label_encoder = dill.load(f)
            svc = dill.load(f)

            return {"vectorizer": vectorizer, "lab_enc": label_encoder, "svc": svc}

    def build_crf(self, crf_path):
        with open(crf_path, "rb") as f:
            crf = dill.load(f)

            return crf

    def da_detect(self, text):
        words = []
        for line in self.mecab.parse(text).splitlines():
            if line == "EOS":
                break
            else:
                word, feature_str = line.split("\t")
                words.append(word)
        tokens_str = " ".join(words)
        X = self.da_detector["vectorizer"].transform([tokens_str])
        Y = self.da_detector["svc"].predict(X)
        # 数値を対応するラベルに戻す
        da = self.da_detector["lab_enc"].inverse_transform(Y)[0]
        return da

    def concept_extract(self, text):
        lis = []
        for line in self.mecab.parse(text).splitlines():
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
        labels = self.concept_extractor.predict(X)[0]

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


def main():
    model = NLU()
    return model