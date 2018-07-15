import StdUtil from "../../Base/Util/StdUtil";
import LinkUtil from "../../Base/Util/LinkUtil";
import CastController from "./CastController";
import SWPeer from "../../Base/WebRTC/SWPeer";

if (StdUtil.IsSupoortPlatform(true)) {
    let controller = new CastController();
    let ownerId = LinkUtil.GetPeerID();
    controller.SwPeer = new SWPeer(controller, ownerId, () => {
        
    });
}