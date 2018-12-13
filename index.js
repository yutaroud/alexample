'use strict';
const Alexa = require('alexa-sdk');
const makePlainText = Alexa.utils.TextUtils.makePlainText;  //テキストの生成　今回は使用していない。
const makeImage = Alexa.utils.ImageUtils.makeImage; //画像の生成


const APP_ID = undefined; //アレクサスキル のIDを入れる。

const SKILL_NAME = 'テストくん';　//スキル名
const GET_FACT_MESSAGE = "テストくん: ";
const HELP_MESSAGE = 'このスキルは〜のスキルです。'; //ヘルプインテントに分類された場合のメッセージ
const HELP_REPROMPT = 'このスキルは〜のスキルです。';//ヘルプインテントに分類された場合のメッセージ(2回目)
const STOP_MESSAGE = 'またね！！';//ストップインテントもしくはキャンセルインテントに分類された場合のメッセージ

// ランダムに表示するメッセージ
const data = [
    '1ばんめ',
    '2ばんめ',
    '3ばんめ',
    '4ばんめ',
    '5ばんめ',
    //xばんめ...
];



// ランダムに表示する画像
const wakuimage = [
    'https://~~.jpg',
    'https://~~.jpg',
    'https://~~.jpg',
    'https://~~.jpg',
    'https://~~.png',
];

//ハンドラーを作成
const handlers = {
    //最初にAlexaに読まれる部分
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetNewFactIntent': function () {
        const factArr = data;
        const factIndex = Math.floor(Math.random() * factArr.length); //乱数を生成
        const randomFact = factArr[factIndex]; //ランダムでテキストを取得
        const speechOutput = GET_FACT_MESSAGE + randomFact; //Alexaに発生させる文章の定義

      if(supportsDisplay.call(this)){
          //ディスプレイがある端末の場合
        const itemim = wakuimage[factIndex]; //ランダムで画像のurlを取得
        const builder = new Alexa.templateBuilders.BodyTemplate1Builder(); //BodyTemplate1を今回は使用している。
        const template = builder.setBackgroundImage(makeImage(itemim)) //テンプレートにBackGroundImageとしてitemimをmakeImage関数で作成した後に登録している。
                         .build(); //ビルドする。
                         
        this.response.speak(speechOutput).renderTemplate(template); //画像を表示する場合はrenderTemplate()の関数を用いる。()の引数には先ほど宣言したtemplateを入れている。
      }
      //ディスプレイがなければ、カードを表示し、応答を返して終了する。
        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },

    //ヘルプインテント。Alexaに助けてというとここに分類される
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },

    //キャンセルインテント。Alexaにやめてというとここに分類される
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    //ストップインテント。Alexaにストップというとここに分類される。
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};


//ハンドラーをエクスポート。　ここをいじることは基本的にない。
exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


//ディスプレイがあるかどうかを判別する関数
function supportsDisplay (){
    var hasDisplay =
        this.event.context &&
        this.event.context.System &&
        this.event.context.System.device &&
        this.event.context.System.device.supportedInterfaces &&
        this.event.context.System.device.supportedInterfaces.Display
    return hasDisplay;
}
