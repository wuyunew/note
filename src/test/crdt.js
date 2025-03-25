//实现一个基于操作的 CRDT
//前提条件，定义操作op
/**
 * {
 * op:'insert',
 * pos:0,
 * value:'a'
 * }
 * 
 * {
 * op:'delete',
 * pos:0,
 * }
 * 
 * {
 * op:'update',
 * pos:0,
 * value:'b'
 * }
 */

const ops=[]
ops.push({
  op:'insert',
  pos:0,
  value:'a'
});
ops.push({
  op:'insert',
  pos:1,
  value:'b'
});


class OpBasedORSet{
    constructor(){
        this.state=new Set() //内部状态
        this.history=new Set()//用于记录已应用的操作，避免重复
    }
    static state_zero(  ){
        return new Set();
    }
    //添加操作的原子操作
    add(element){
        const op={
            type:'add',
            element
        }
        if(this.check_state(this.state,op)){
            this.apply_op(op)
        }
    }
    //删除操作的原子操作
    remove(element){
        const op={
            type:'remove',
            element
        }
        if(this.check_state(this.state,op)){
            this.apply_op(op)
        }
    }
    //在state上应用op函数
    apply_op(op){
        const key=JSON.stringify(op)
        if(!this.history.has(key)){
            if(op.type==='add'){
                this.state.add(op.element)
            }else if(op.type==='remove'){
                this.state.delete(op.element)
            }
            this.history.add(key)
        }
    }
    //检查操作的前置条件
    check_state(state,op){
        if(op.type==='remove'){
            return state.has(op.element)
        }
        return true;
    }
    getElements(){
        return Array.from(this.state)
    }
}