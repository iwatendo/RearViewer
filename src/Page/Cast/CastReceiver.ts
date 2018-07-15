
import AbstractServiceReceiver from "../../Base/AbstractServiceReceiver";
import Sender from "../../Base/Container/Sender";
import CastController from "./CastController";
import CastSettingSender from "../../Contents/Sender/CastSettingSender";
import GetCastSettingSedner from "../../Contents/Sender/GetCastSettingSedner";

export class CastReceiver extends AbstractServiceReceiver<CastController> {


    /**
     * 
     */
    public Receive(conn: PeerJs.DataConnection, sender: Sender) {

        //
        if (sender.type === GetCastSettingSedner.ID) {
            this.Controller.SwPeer.SendTo(conn, this.Controller.CastSetting);
        }

        if (sender.type === CastSettingSender.ID) {
            let mcs = sender as CastSettingSender;
            this.Controller.SetCastSetting(mcs);
        }

    }

}