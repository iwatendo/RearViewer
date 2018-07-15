
import AbstractServiceReceiver from "../../Base/AbstractServiceReceiver";
import Sender from "../../Base/Container/Sender";
import DisplayController from "./DisplayController";
import CastSettingSender from "../../Contents/Sender/CastSettingSender";


export class DisplayReceiver extends AbstractServiceReceiver<DisplayController> {


    /**
     * 
     */
    public Receive(conn: PeerJs.DataConnection, sender: Sender) {

        //  キャスト情報の通知
        if (sender.type === CastSettingSender.ID) {
            this.Controller.JoinRoom();
        }

    }

}