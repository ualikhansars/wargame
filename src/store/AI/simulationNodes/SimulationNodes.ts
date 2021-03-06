import MapNode from "../../../map/nodes/MapNode";

class SimulationNodes {

    private maxSize: number = 1000;
    private top = -1;
    private elements: MapNode[] = [];
    private nodesMemo: any = {};
   
    isEmpty() {
        if(this.top === -1) {
            return true;
        } else {
            return false;
        }
    }
    
    push(node: MapNode) {
        if(this.top === this.maxSize) {
            throw new Error('Stack overflow');
        } else {
            if(!this.nodesMemo.hasOwnProperty(node.id)) {
                this.nodesMemo[node.id] = true;
                this.top += 1;
                this.elements[this.top] = node;
            }
        }
    }

    moveTop(position: number) {
        if(position <= this.top) {
            this.top -= position;
        }
    }

    clearMemo() {
        this.nodesMemo = {};
    }

    pop() {
        if(this.isEmpty()) {
            throw new Error('Stack underflow');
        } else {
            this.top -= 1;
            return this.elements[this.top + 1];
        }
    }
}

export default SimulationNodes;