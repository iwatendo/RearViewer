import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import SWPeer from "../../Base/WebRTC/SWPeer";
import DisplayController from "./DisplayController";

if (StdUtil.IsSupoortPlatform(true)) {

    let controller = new DisplayController();
    let ownerId = LinkUtil.GetPeerID();
    controller.SwPeer = new SWPeer(controller, ownerId, () => { });
}
