
import AbstractServiceReceiver from "../../Base/AbstractServiceReceiver";
import Sender from "../../Base/Container/Sender";
import TopPageController from "./TopPageController";
import CastStatusSender from "../../Base/Container/CastStatusSender";


export class TopPageReceiver extends AbstractServiceReceiver<TopPageController> {

    /**
     * 
     */
    public Receive(conn: PeerJs.DataConnection, sender: Sender) {

        //  配信ステータスはオーナー側にも送信
        if (sender.type === CastStatusSender.ID) {
            this.Controller.View.SetCastStauts(sender as CastStatusSender);
        }

    }

}
