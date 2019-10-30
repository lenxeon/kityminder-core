/**
 * @fileOverview
 *
 * 初始化渲染容器
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function (require, exports, module) {
    var kity = require('./kity');
    var utils = require('./utils');
    var Minder = require('./minder');

    Minder.registerInitHook(function () {
        this._initPaper();
    });

    kity.extendClass(Minder, {

        _initPaper: function () {

            this._paper = new kity.Paper();
            this._paper._minder = this;
            this._paper.getNode().ondragstart = function (e) {
                e.preventDefault();
            };
            this._paper.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)');

            this._addRenderContainer();

            this.setRoot(this.createNode());

            if (this._options.renderTo) {
                this.renderTo(this._options.renderTo);
            }
            //基准线
            var rect = new kity.Group();
            // rect.shapeNode.setAttribute('transform', 'translate(0.5, 0.5)');
            // rect.style('stroke:#efefef;stroke-width:1;')
            // 添加单个图形
            this._rc.addShape(rect, 0);
            var step = 20
            for (var i = -100; i < 100; i++) {
                var rowLine = new kity.Line(i * step, -3000, i * step, 3000);
                rowLine.fill('white')
                rowLine.stroke('#eeeeee');
                rect.appendShape(rowLine);
                var colLine = new kity.Line(-3000, i * step, 3000, i * step);
                colLine.fill('white')
                colLine.stroke('#eeeeee');
                rect.appendShape(colLine);
            }
            //基准线
        },

        _addRenderContainer: function () {
            this._rc = new kity.Group().setId(utils.uuid('minder'));
            this._paper.addShape(this._rc);
        },

        renderTo: function (target) {
            if (typeof(target) == 'string') {
                target = document.querySelector(target);
            }
            if (target) {
                if (target.tagName.toLowerCase() == 'script') {
                    var newTarget = document.createElement('div');
                    newTarget.id = target.id;
                    newTarget.class = target.class;
                    target.parentNode.insertBefore(newTarget, target);
                    target.parentNode.removeChild(target);
                    target = newTarget;
                }
                target.classList.add('km-view');
                this._paper.renderTo(this._renderTarget = target);
                this._bindEvents();
                this.fire('paperrender');
            }
            return this;
        },

        getRenderContainer: function () {
            return this._rc;
        },

        getPaper: function () {
            return this._paper;
        },

        getRenderTarget: function () {
            return this._renderTarget;
        },
    });
});