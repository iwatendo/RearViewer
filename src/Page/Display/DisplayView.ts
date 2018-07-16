import AbstractServiceView, { OnViewLoad } from "../../Base/AbstractServiceView";
import StdUtil from "../../Base/Util/StdUtil";
import DisplayController from "./DisplayController";

/**
 * 
 */
export class DisplayView extends AbstractServiceView<DisplayController> {


    public IsMobile: boolean;


    //
    public Initialize(callback: OnViewLoad) {

        StdUtil.StopPropagation();
        StdUtil.StopTouchMove();
        StdUtil.StopTouchZoom();

        callback();
    }

    /**
     * 「接続中」の表示を消す
     */
    public MessageHide(){
        document.getElementById('message-port').hidden = true;
    }

}