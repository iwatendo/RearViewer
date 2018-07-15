
import AbstractServiceController from "../../Base/AbstractServiceController";
import LinkUtil from "../../Base/Util/LinkUtil";
import CastStatusSender, { CastTypeEnum } from "../../Base/Container/CastStatusSender";

import CastModel from "./CastModel";
import CastView from "./CastView";
import { CastReceiver } from "./CastReceiver";
import StreamUtil from "../../Base/Util/StreamUtil";
import SWRoom, { SWRoomMode } from "../../Base/WebRTC/SWRoom";
import CastSettingSender from "../../Contents/Sender/CastSettingSender";
import TerminalInfoSender from "../../Contents/Sender/TerminalInfoSender";
import ConnCountSender from "../../Contents/Sender/ConnCountSender";

export default class CastController extends AbstractServiceController<CastView, CastModel> {

    public ControllerName(): string { return "Cast"; }

    public View: CastView;

    public CastStatus = new CastStatusSender(CastTypeEnum.LiveCast);
    public CastSetting = new CastSettingSender();
    public Stream: MediaStream;

    private _roomPeerMap = new Map<string, string>();

    /**
     *
     */
    constructor() {
        super();
        this.Receiver = new CastReceiver(this);
    };


    private _peerid: string = null;


    /**
     * 自身のPeer生成時イベント
     * @param peer
     */
    public OnPeerOpen(peer: PeerJs.Peer) {
        this._peerid = peer.id;
        this.View = new CastView(this, () => { });
    }
    

    /**
     * 切断時処理
     */
    public OnPeerClose() {
        if (this.IsOpen) {
            this.ServerSend(false, true);
        }
    }


    /**
     * オーナー接続時イベント
     */
    public OnOwnerConnection() {
        this.CastStatus = new CastStatusSender(CastTypeEnum.LiveCast);
        this.CastStatus.instanceUrl = location.href;
        this.CastStatus.clientUrl = LinkUtil.CreateLink('../CastVisitor/index.html', this._peerid) + "&sfu=" + (this.CastSetting.isSFU ? 1 : 0);
        this.SwPeer.SendToOwner(this.CastStatus);
        this.SendTerminalInfo();
    }


    /**
     * オーナー側が切断した場合
     */
    public OnOwnerClose() {
        //  全てのクライアントとの接続を終了します
        this.SwPeer.Close();
        this.PageClose();
    }


    /**
     * 他クライアントからの接続時イベント
     * @param conn
     */
    public OnDataConnectionOpen(conn: PeerJs.DataConnection) {
        super.OnDataConnectionOpen(conn);

        //  配信設定の通知
        this.SwPeer.SendTo(conn, this.CastSetting);
    }


    /**
     * 
     */
    public OnRoomPeerJoin(peerid: string) {
        this._roomPeerMap.set(peerid, peerid);
        this.SendPeerCount(this._roomPeerMap.size);
    }


    /**
     * 
     */
    public OnRoomPeerLeave(peerid: string) {
        this._roomPeerMap.delete(peerid);
        this.SendPeerCount(this._roomPeerMap.size);
    }


    /**
     * 
     * @param mcs 
     */
    public SetCastSetting(mcs: CastSettingSender) {
        this.CastSetting = mcs;
        this.SwPeer.SendAll(mcs);
    }


    /**
     * ストリーミングの開始
     */
    public StartStreaming() {

        let roomName = this.SwPeer.PeerId;        //  PeerIDをルーム名称とする
        let roomMode = (this.CastSetting.isSFU ? SWRoomMode.SFU : SWRoomMode.Mesh);
        this.SwRoom = new SWRoom(this, roomName, roomMode, this.Stream);

        this.ServerSend(true, false);
    }


    /**
     * ストリーミングの停止
     */
    public StopStreaming() {
        if (this.SwRoom) {
            this.SwRoom.Close();
            StreamUtil.Stop(this.Stream);
            this.ServerSend(false, false);
        }
    }


    /**
     * ストリーミングの開始/停止の通知
     * @param isStreaming 
     * @param isHide 
     */
    public ServerSend(isStreaming: boolean, isClose: boolean) {

        if (!isClose && this.CastStatus.isCasting == isStreaming)
            return;

        this.CastStatus.isCasting = isStreaming;
        this.CastStatus.isClose = isClose;
        this.CastStatus.isHide = false;
        this.CastStatus.clientUrl = LinkUtil.CreateLink('../Display/index.html', this._peerid) + "&sfu=" + (this.CastSetting.isSFU ? 1 : 0);
        this.CastStatus.isOrientationChange = false;

        this.SendCastInfo();
    }


    /**
     * 
     */
    public SendOrientationChange() {
        this.CastStatus.isOrientationChange = true;
        this.SendCastInfo();
    }


    /**
     * ストリーミングの開始/停止の通知
     */
    public SendCastInfo() {

        //  クライアントへの通知
        this.SwPeer.SendAll(this.CastSetting);

        //  オーナー側への通知
        if (this.CastStatus) {
            this.SwPeer.SendToOwner(this.CastStatus);
        }
    }


    /**
     * 端末情報を送信
     */
    public SendTerminalInfo() {
        let info = new TerminalInfoSender();
        info.platform = window.navigator.platform;
        info.userAgent = window.navigator.userAgent;
        info.appVersion = window.navigator.appVersion;
        this.SwPeer.SendToOwner(info);
    }


    /**
     * 接続数を送信
     * @param count 
     */
    public SendPeerCount(count: number) {
        let info = new ConnCountSender();
        info.count = count;
        this.SwPeer.SendToOwner(info);
    }


    /**
     *  配信準備ができているか？
     */
    public IsReady() {
        return true;
    }

};
