import AbstractServiceView, { OnViewLoad } from "../../Base/AbstractServiceView";
import StdUtil from "../../Base/Util/StdUtil";
import StreamUtil, { MobileCam } from "../../Base/Util/StreamUtil";

import CastController from "./CastController";

declare var ons: any;

export default class CastView extends AbstractServiceView<CastController> {

    private _micMute: boolean = false;

    /**
     * 初期化処理
     */
    public Initialize(callback) {

        (window as any).AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
        StdUtil.StopPropagation();
        StdUtil.StopTouchMove();
        StdUtil.StopTouchZoom();

        let startBotton = document.getElementById('sbj-cast-instance-start') as HTMLInputElement;
        let stopBotton = document.getElementById('sbj-cast-instance-stop');

        //  ストリーミング開始ボタン
        document.getElementById('sbj-cast-instance-start').onclick = (e) => {
            this.Controller.StartStreaming();
            document.getElementById('sbj-bottom-toolbar').hidden = true;
        }

        //  ストリーミング停止ボタン
        stopBotton.onclick = (e) => {
            this.Controller.StopStreaming();
            this.Controller.SwPeer.Close();
            this.Controller.PageClose();
        };

        //  プレビュー表示処理
        let startPreviewFunc = (cam: MobileCam) => {
            setTimeout(() => {
                this.SetStreamPreview(cam, () => {
                    startBotton.disabled = false;
                });
            }, 200);
        }

        //  スマホ画面の回転時イベント
        let controller = this.Controller;
        document.addEventListener("DOMContentLoaded", () => { this.SendOrientationChange(controller); });
        window.addEventListener('orientationchange', () => { this.SendOrientationChange(controller); }, false);

        //  起動時はリアカメラでプレビュー表示する
        startPreviewFunc(MobileCam.REAR);

        callback();
    }


    /**
     * 配信開始可能か確認
     */
    public ReadyCheck() {

        let disabled = true;

        if (this.Controller.IsReady()) {
            disabled = false;
        }

        let startButton = document.getElementById('sbj-cast-instance-start') as HTMLButtonElement;
        startButton.disabled = disabled;
    }


    /**
     * メニューを閉じる
     */
    public MenuClose() {
        var menu = document.getElementById('menu') as any;
        menu.close();
    }


    public StopStreamPreview() {

        let videoElement = document.getElementById('sbj-video-preview') as HTMLVideoElement;
        if (videoElement) videoElement.srcObject = null;

        if (this.Controller.Stream) {
            StreamUtil.Stop(this.Controller.Stream);
        }
    }


    /**
     * Video/Audioソースの取得とリストへのセット
     */
    public SetStreamPreview(cam: MobileCam, callback) {

        let controller = this.Controller;
        let videoElement = document.getElementById('sbj-video-preview') as HTMLVideoElement;

        let msc: MediaStreamConstraints;
        let isDebug = false;

        if (isDebug) {
            msc = StreamUtil.GetMediaStreamConstraints_DefaultDevice();
        }
        else {
            /* マイクデバイスは取得しない */
            msc = StreamUtil.GetMediaStreamConstraints_Mobile(cam, false);
        }

        StreamUtil.GetStreaming(msc,
            (stream) => {
                if (this.Controller.SwRoom) {

                    if (this._micMute) {
                        StreamUtil.SetMute(stream, true);
                    }

                    this.Controller.SwRoom.Refresh(stream);
                }

                controller.Stream = stream;

                if (stream && videoElement) {
                    videoElement.onplaying = (e) => { callback(); }
                    StreamUtil.StartPreview(videoElement, stream);
                }
                else {
                    callback();
                }
            },
            (error) => {
                this.StreamErrorClose();
                alert(error);
            }
        );
    }


    /**
     * ストリームが取得できなかった場合、メッセージ表示して終了する
     */
    public StreamErrorClose() {
        document.getElementById('sbj-video-preview').hidden = true;

        let msg = "カメラデバイスへの接続に失敗しました\n";
        msg += "LINE等のアプリから開いた場合、アプリ内のブラウザから標準ブラウザ（iPhoneの場合 Safari / Androidの場合 Chrome)を開いてください。";
        alert(msg);
        this.Controller.SwPeer.Close();
    }

    /**
     * 
     * @param controller 
     */
    public SendOrientationChange(controller: CastController) {
        controller.SendOrientationChange();

    }

}
