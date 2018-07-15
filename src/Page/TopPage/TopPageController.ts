import AbstractServiceController from "../../Base/AbstractServiceController";
import TopPageModel from "./TopPageModel";
import TopPageView from "./TopPageView";
import { TopPageReceiver } from "./TopPageReceiver";
import CastStatusSender, { CastTypeEnum } from "../../Base/Container/CastStatusSender";


export default class TopPageController extends AbstractServiceController<TopPageView, TopPageModel> {

    public ControllerName(): string { return "TopPage"; }

    public CastStatus: CastStatusSender;

    /**
     *
     */
    constructor() {
        super();
        this.Receiver = new TopPageReceiver(this);
    };


    protected Initilize() {
    }


    /**
     * 自身のPeer生成時イベント
     * @param peer
     */
    public OnPeerOpen(peer: PeerJs.Peer) {
        this.View = new TopPageView(this, () => { });
    }


    /**
     * 切断時イベント
     * @param conn
     */
    public OnDataConnectionClose(conn: PeerJs.DataConnection) {
        this.View.SetLiveCastQRCode();
        this.View.SetCastStauts(null);
    }

};
