/**
 * @fileOverview
 *
 * 下划线连线
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */

define(function (require, exports, module) {
    var kity = require('../core/kity');
    var connect = require('../core/connect');

    connect.register('under', function (node, parent, connection, width, color) {

        var box = node.getLayoutBox();//结束节点
        var pBox = parent.getLayoutBox();//开始节点

        var start, end, vector;
        var abs = Math.abs;
        var pathData = [];
        var side = box.x > pBox.x ? 'right' : 'left';
        var offset = 17;//为了让展开收起更好看


        var radius = node.getStyle('connect-radius');
        var underY = box.bottom + 3;
        var startY = parent.getType() == 'sub' ? pBox.bottom + 3 : pBox.cy;
        var p1;//起点
        var p2;//辅助点
        var p3;//终点
        var rect = {
            x: 10,
            y: 15
        }

        if (side == 'right') {
            p1 = new kity.Point(pBox.right + offset, startY);
            p2 = new kity.Point(pBox.right + offset, underY);
            p3 = new kity.Point(box.right, underY);
        } else {
            p1 = new kity.Point(pBox.left - offset, startY);
            p2 = new kity.Point(pBox.left - offset, underY);//辅助节点为开始点的x和结束点的y
            p3 = new kity.Point(box.left, underY);
        }

        //右侧参考数据 M 1051 165 L 1051 104 Q 1051 89 1066 89 L 1124 89
        //左侧参数数据 M 376 237 L 376 195 Q 376 180 361 180 L 249 180
        var L01 = {x: p3.x > p1.x ? p1.x : p1.x, y: p3.y < p1.y ? p3.y + rect.y : p3.y - rect.y};
        var Q01 = {x: p1.x, y: p3.y};
        var Q02 = {
            x: p3.y == p1.y ? Q01.x : p3.x > p1.x ? p1.x + rect.x : p1.x - rect.x,
            y: p3.y == p1.y ? Q01.y : p3.y < p1.y ? p3.y : p3.y
        };
        if (p3.y == p1.y) {
            console.log(Q01, Q02)
        }

        pathData.push('M', p1);
        pathData.push('L', new kity.Point(L01.x, L01.y));
        pathData.push('Q', new kity.Point(Q01.x, Q01.y), new kity.Point(Q02.x, Q02.y));
        pathData.push('L', p3);


        connection.setMarker(null);

        connection.setPathData(pathData);
    });
});