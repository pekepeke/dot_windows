TortoiseSVNプラグイン 2010/04/17

バージョン管理ソフトTortoiseSVNのコマンドをサクラエディタから呼び出します。
以下の機能を実装済みです。
  ログ
  差分
  コミット
サクラエディタUNICODE版r1737以降が必要です。


■インストール
１．pluginsフォルダ内にzipを解凍する。
    ※pluginsフォルダが無い場合はsakuraW.iniと同じ場所に作成する。
２．共通設定―プラグインで、プラグインを有効にし、「新規プラグインを追加」でTortoiseSVNPluginを追加する。
３．「設定」で、TortoiseSVNのインストールフォルダを指定する。
    ※例）C:\Program Files\TortoiseSVN
以上です！


■つかいかた
メニューの[ツール]にTortoiseSVNプラグインという項目が追加されます。
基本的に、編集中のファイルに対してコマンドを実行します。
コマンドはツールバーや右クリックメニューに追加することもできます。


■よくある質問
Q. アイコンが見づらい。
A. プラグインのアイコンはツールバーの色数に引きずられるため、16色の既定アイコンだときたなく見えます。
   エディタと同じフォルダに256色以上のmy_icons.bmpを置くと直ります。
   差し替えアイコンはWikiから探してください。 http://sakura.qp.land.to/?Customize%2FIcons

Q. ○○機能が無いよ！
A. 今のところログ、差分、コミットしかありません。
   今後増えるかもしれませんし、増えないかもしれません。

   でもちょっと待って。
   TortoiseSVNのコマンドは以下で調べられます。
   http://tortoisesvn.net/docs/release/TortoiseSVN_ja/tsvn-automation.html
   またプラグインのソースは全公開＆テキストなので改造も簡単です。

