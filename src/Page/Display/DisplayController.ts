import AbstractServiceController from "../../Base/AbstractServiceController";
import MessageChannelUtil from "../../Base/Util/MessageChannelUtil";
import GetCastSettingSedner from "../../Contents/Sender/GetCastSettingSedner";
import { DisplayView } from "./DisplayView";
import DisplayModel from "./DisplayModel";
import { DisplayReceiver } from "./DisplayReceiver";
import LinkUtil from "../../Base/Util/LinkUtil";
import SWRoom, { SWRoomMode } from "../../Base/WebRTC/SWRoom";


export default class DisplayController extends AbstractServiceController<DisplayView, DisplayModel> {

    public ControllerName(): string { return "Display"; }

    public View: DisplayView;

    private _castPeerId: string;

    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this.Receiver = new DisplayReceiver(this);
    };


    /**
     * 自身のPeer生成時イベント
     */
    public OnPeerOpen(peer: PeerJs.Peer) {

        this.View = new DisplayView(this, () => {
            //  
        });
    }

    public OnPeerClose() {
        MessageChannelUtil.RemoveChild(this.SwPeer.PeerId);
    }


    //  Peerエラー
    public OnPeerError(err: Error) {
        document.getElementById('message-port').hidden = false;
        document.getElementById('message').textContent = "接続に失敗、またはライブキャストは終了しています";
    }


    /**
     * オーナー接続時イベント
     */
    public OnOwnerConnection() {
        //  キャスト情報の要求
        this.SwPeer.SendToOwner(new GetCastSettingSedner());
    }


    /**
     * 
     * @param conn 
     */
    public OnDataConnectionOpen(conn: PeerJs.DataConnection) {
        super.OnDataConnectionOpen(conn);
    }


    /**
     * 
     * @param conn 
     */
    public OnDataConnectionClose(conn: PeerJs.DataConnection) {
        super.OnDataConnectionClose(conn);
    }


    /**
     * スリープ関数
     * @param milliseconds 
     */
    private Sleep(milliseconds: number) {
        return new Promise<void>(resolve => { setTimeout(() => resolve(), milliseconds); });
    }


    public JoinRoom() {
        if (!this.SwRoom) {
            let roomMode = (this.UseSFU() ? SWRoomMode.SFU : SWRoomMode.Mesh);
            this.SwRoom = new SWRoom(this, LinkUtil.GetPeerID(), roomMode);
        }
    }


    /** 
     * 
     */
    public UseSFU(): boolean {
        let arg = LinkUtil.GetArgs('sfu');
        if (arg === "1") return true;
        if (arg === "0") return false;
        //  オプション未指定時はSFU使用と判定する
        return true;
    }


    /**
     * 
     */
    public OnRoomOpen() {
    }



    /**
     * 
     * @param peerid 
     * @param stream 
     */
    public OnRoomStream(peerid: string, stream: MediaStream) {

        let element = document.getElementById('sbj-video') as HTMLVideoElement;

        if (element) {
            this._castPeerId = peerid;
            element.hidden = false;
            element.srcObject = stream;
            element.oncanplay = (e) => {
                this.View.MessageHide();
                element.play();
            }
        }
    }

};
