import LinkUtil from "../../Base/Util/LinkUtil";
import StdUtil from "../../Base/Util/StdUtil";
import SWPeer from "../../Base/WebRTC/SWPeer";
import TopPageController from "./TopPageController";


if (StdUtil.IsSupoortPlatform(true)) {

    let controller = new TopPageController();
    let ownerId = LinkUtil.GetPeerID();
    controller.SwPeer = new SWPeer(controller, ownerId, () => null);
}