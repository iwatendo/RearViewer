import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import AbstractServiceView, { OnViewLoad } from "../../Base/AbstractServiceView";
import TopPageController from "./TopPageController";
import CastStatusSender from "../../Base/Container/CastStatusSender";


export default class TopPageView extends AbstractServiceView<TopPageController> {

    /**
     * 初期化処理
     */
    public Initialize(callback: OnViewLoad) {

        StdUtil.StopPropagation();
        this.SetLiveCastQRCode();

        callback();
    }

    /**
     * 
     */
    public SetLiveCastQRCode() {
        let linkurl = LinkUtil.CreateLink("./Cast/", this.Controller.SwPeer.PeerId);
        let element = document.getElementById('sbj-mobile-qrcode') as HTMLFrameElement;
        element.src = LinkUtil.CreateLink("../QrCode/") + "?linkurl=" + encodeURIComponent(linkurl);
    }

    /**
     * 
     * @param status 
     */
    public SetCastStauts(status: CastStatusSender) {

        if (status && status.isOrientationChange) {
            return;
        }

        let qrElement = document.getElementById('sbj-mobile-qrcode') as HTMLFrameElement;
        let diplayElement = document.getElementById('sbj-display') as HTMLFrameElement;

        let isCasting: boolean = (status ? status.isCasting : false);

        qrElement.hidden = isCasting;
        diplayElement.hidden = !isCasting;
        diplayElement.src = (isCasting ? status.clientUrl : "");

    }

}
