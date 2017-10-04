window.addEventListener("load", () => {

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const TreeNode = {
        create(val, deep) {
            var tn = Object.create(TreeNode.proto);
            tn.val = val;
            tn.deep = deep;
            tn.left = null;
            tn.right = null;
            tn.x = 0;
            tn.y = 0;
            return tn;
        },
        proto: {
            isNode() {
                return !!(this.left || this.right);
            }
        }
    };

    const root = TreeNode.create(50, 0);
    root.left = TreeNode.create(25, 1);
    root.right = TreeNode.create(75, 1);

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
                var x = 0;
                if (node.left) {
                    track(node.left);
                    x += node.left.x;
                }
                if (node.right) {
                    track(node.right);
                    x += node.right.x;
                }
                node.x = x / (+!!node.left + +!!node.right)
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
                if (node.left) {
                    drawLine(node.x, node.y, node.left.x, node.left.y);
                    draw(node.left);
                }
                if (node.right) {
                    drawLine(node.x, node.y, node.right.x, node.right.y);
                    draw(node.right);
                }
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
        return () => {
            reaf = maxX = maxY = 0;
            track(root);
            canvas.width = maxX + MARGIN;
            canvas.height = maxY + MARGIN;
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";
            ctx.font = "10pt 'sans-serif'";
            draw(root);
        }
    })()

    function addNode(val, node = root) {
        if(val < node.val) {
            if(!node.left) {
                node.left = TreeNode.create(val, node.deep + 1);
                drawTree();
            } else {
                addNode(val, node.left);
            }
        } else if(val > node.val) {
            if(!node.right) {
                node.right = TreeNode.create(val, node.deep + 1);
                drawTree();
            } else {
                addNode(val, node.right);
            }
        } else {
            alert("その値は既に木に存在します");
        }
    }

    const num = document.getElementById("num");
    const add = document.getElementById("add");
    add.addEventListener("click", e => {
        addNode(+num.value)
    });

    drawTree();

});