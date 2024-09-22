///////////
// 定数定義
///////////

// Slack BotトークンとスプレッドシートIDの定義
const SLACK_BOT_TOKEN = PropertiesService.getScriptProperties().getProperty('SLACK_TOKEN')
const SLACK_CHANNEL_ID = PropertiesService.getScriptProperties().getProperty('SLACK_CHANNEL_ID')
const SPREADSHEET_ID = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID')

// Slackにメッセージを送信する関数
function postSlackbot() {
  let token = SLACK_BOT_TOKEN;
  let slackApp = SlackApp.create(token); // SlackAppオブジェクトの作成
  let channelId = SLACK_CHANNEL_ID; // メッセージを送信するチャンネルID
  let message = getMessage(); // メッセージの取得
  if (message) {
    slackApp.postMessage(channelId, message); // メッセージをSlackに送信
    Logger.log("Slackへのメッセージ送信が成功しました: " + message); // 送信成功のログ
  } else {
    Logger.log("本日送信するメッセージがありません。"); // メッセージがない場合のログ
  }
}

// 今日の日付かどうかを判定する関数
function isToday(today, dateObj) {
  return today.toString() == dateObj;
}

// スプレッドシートからメッセージを取得する関数
function getMessage() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID); // スプレッドシートを開く
  const sheet = spreadsheet.getSheets()[0]; // シートを取得
  const range = sheet.getDataRange(); // データ範囲を取得
  const values = range.getValues(); // データ範囲の値を取得

  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0); // 今日の日付を設定

  // 各行のデータをループしてチェック
  for (let i = 0; i < values.length; i++) {
    if (values[i][2] && isToday(today, values[i][0])) { // 今日の日付と一致する行を探す
      let lt_day_count = values[i][1]; //day1
      let lt_content_en = values[i][2];

      let postInfo = "＜グローバルエンジニアの道＞\n" + 
                     "**回答は送信ボタンから13:00に予約投稿してね**\n" + 
                     "⚠️GPTは使用禁止です!!\n" + 
                     lt_day_count + "\n" + lt_content_en

      return postInfo;
    }
  }
  Logger.log("本日該当するLT情報が見つかりませんでした。"); // 該当する情報がない場合のログ
  return null;
}
