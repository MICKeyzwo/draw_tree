window.addEventListener("load", () => {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const TreeNode = {
        create(val, deep) {
            var tn = Object.create(TreeNode.proto);
            tn.val = val;
            tn.deep = deep;
            tn.child = [];
            tn.x = 0;
            tn.y = 0;
            return tn;
        },
        proto: {
            isNode() {
                return !!(this.child.length);
            },
            getChildXAvg() {
                var sum = 0;
                this.child.forEach(item => sum += item.x);
                return sum / this.child.length;
            }
        }
    };

    const MARGIN = 30;
    const DISTANCE_X = 60;
    const DISTANCE_Y = 50;
    const RADIUS = 15;
    const PI2 = Math.PI * 2;

    const drawTree = (() => {
        var reaf = 0;
        var maxX = 0;
        var maxY = 0;
        function track(node) {
            if (node.isNode()) {
                node.child.forEach(item => track(item));
                node.x = node.getChildXAvg();
                node.y = MARGIN + DISTANCE_Y * node.deep;
            } else {
                node.x = MARGIN + DISTANCE_X * reaf++;
                node.y = MARGIN + DISTANCE_Y * node.deep;
            }
            if (node.x > maxX) maxX = node.x;
            if (node.y > maxY) maxY = node.y;
        }
        function draw(node) {
            if (node.isNode()) {
                node.child.forEach(item => {
                    drawLine(node.x, node.y, item.x, item.y);
                    draw(item);
                });
            }
            drawCircle(node.x, node.y);
            drawStr(node.x, node.y, node.val);
        }
        function drawLine(bx, by, ex, ey) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(bx, by);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.restore();
        }
        function drawCircle(x, y) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.arc(x, y, RADIUS, 0, PI2);
            ctx.stroke();
            ctx.fillStyle = "silver";
            ctx.fill();
            ctx.restore();
        }
        function drawStr(x, y, str) {
            ctx.save();
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.fillText(str, x, y);
            ctx.restore();
        }
        return (root) => {
            reaf = maxX = maxY = 0;
            track(root);
            canvas.width = maxX + MARGIN;
            canvas.height = maxY + MARGIN;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";
            ctx.font = "10pt 'sans-serif'";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            draw(root);
        }
    })();

    const createTree = (() => {
        function make(n, j, d) {
            if(j.child.length > 0) {
                j.child.forEach(item =>{
                    var tmp = TreeNode.create(item.val, d + 1);
                    n.child.push(tmp);
                    make(tmp, item, d + 1);
                });
            }
        }
        return json => {
            var root = TreeNode.create(json.val, 0);
            make(root, json, 0);
            return root;
        }
    })();

    function parseCheck(val) {
        try {
            var json = JSON.parse(val);
            return createTree(json);
        } catch(e) {
            console.log(e);
            return false;
        }
    }

    const dataSrc = document.getElementById("txt");
    dataSrc.addEventListener("keydown", e => {
        if(e.keyCode == 9) {
            e.preventDefault();
            var ele = e.target;
            var val = ele.value;
            var pos = ele.selectionStart;
            ele.value = val.substr(0, pos) + "    " + val.substr(pos, val.length);
            ele.setSelectionRange(pos + 4, pos + 4);
            return false;
        }
    });
    const drawBtn = document.getElementById("draw");
    drawBtn.addEventListener("click", e => {
        var root = parseCheck(dataSrc.value);
        if(root) drawTree(root);
        console.log(root);
    });

    var defaultValue = `{
    "val": "hoge",
    "child": [
        {
            "val": "fuga",
            "child": [
                {
                    "val": "bar",
                    "child": []
                },
                {
                    "val": "foo",
                    "child": []
                }
            ]
        },
        {
            "val": "moge",
            "child": []
        }
    ]
}`;

    dataSrc.value = defaultValue;
    drawBtn.click();

});