<template>
    <div id="main">
        <div class="carNumber"@click="onTypewriting">
            <input type="text" v-model="carNumber" maxlength="8" readonly> <!-- ①一个输入框 -->
        </div>
        <span@click="onOfferTap" class="cherkBtn">确定</span> <!-- ②确定按钮 -->
        <div class="typer" v-show="showTyper!=0"> <!-- ③输入键盘 -->
            <ul v-show="showTyper==1"> <!-- ④省的输入 -->
                <li class="typer-pro" v-for="item in provinces" :class="{'is-closeType':item=='关闭'}"@click="input(item)">{{item}}</li>
            </ul>
            <ul v-show="showTyper==2"> <!-- ⑤字母数字的输入 -->
                <li class="typer-num" v-for="item in keyNums" :class="{'is-A': item=='A','is-OK':item=='OK','is-Del':item=='Del'}"@click="input(item)">{{item}}</li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
        data(){
            return {
              showTyper: 0,    //输入法的值，0表示不显示，1表示显示省输入键盘，2表示显示数字字母输入键盘
            provinces:["京","沪","浙","苏","粤","鲁","晋","冀",    //省
                "豫","川","渝","辽","吉","黑","皖","鄂",
                "津","贵","云","桂","琼","青","新","藏",
                "蒙","宁","甘","陕","闽","赣","湘","关闭"],
            keyNums:["0","1","2","3","4","5","6","7","8","9",     //数字字母
                "Q","W","E","R","T","Y","U","I","O","P",
                "A","S","D","F","G","H","J","K","L",
                "OK","Z","X","C","V","B","N","M","Del"],
            carNumber:'',    //输入的值
 
            }
        },
        methods: {
            onOfferTap: function () {   //对最终结果进行判断
                var carNumberReg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
                if (!carNumberReg.test(this.carNumber)) {
                    console.log('请输入正确的车牌号码');
                    return;
                }
            },
            onTypewriting:function () {    //点击输入框时，弹出键盘
                this.showTyper = 1;
                this.changeTyper();
            },
            changeTyper:function () {    //判断输入的车牌号处于什么状态，为空？已输入第一个值（即省）？输入省之后的值？
                if(this.carNumber.length>=1){
                    this.showTyper = 2;
                }
                if(this.carNumber.length==0){
                    this.showTyper = 1;
                }
            },
            input:function (item) {    //键盘点击事件，传入键盘本身的值
                if(item=='OK'||item=='关闭'){    //判断是否点击了关闭按钮
                    this.showTyper = 0;
                    return;
                }
                if (item=='Del'){    //判断是否点击了删除按钮
                    this.carNumber = this.carNumber.slice(0,-1);
                    this.changeTyper();
                    return;
                }
                if(this.carNumber.length<7){    //判断当前的车牌号的数目是否合法，还未超出7位则可继续输入
                    this.carNumber=this.carNumber+item;
                    this.changeTyper();
                }else {
                    console.log('车牌号码超出正常范围');
                }
            }
        }
}
</script>
<style >
    .typer ul{
        display:flex;
        flex-wrap: wrap;
    }
    .typer ul li{
        width: 10vw;
        height: 10vw;
        text-align: center;
        line-height: 10vw;
    }
</style>
