/**
 * @fileOverview
 *
 * 支持节点详细信息（HTML）格式
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function (require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    Module.register('NoteModule', function () {

        var NOTE_PATH = 'M783.83 103.165h-543.284c-38.502 0-69.716 31.212-69.716 69.716v679.17c0 38.502 31.213 69.716 69.716 69.716h543.284c38.502 0 69.716-31.213 69.716-69.716v-679.17c0-38.502-31.213-69.716-69.716-69.716zM307.268 307.819h204.131v65.488h-204.131v-65.488zM716.802 781.538h-409.534v-65.488h409.534v65.488zM716.802 577.423h-409.534v-65.488h409.534v65.488z';


        /**
         * @command Note
         * @description 设置节点的备注信息
         * @param {string} note 要设置的备注信息，设置为 null 则移除备注信息
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        var NoteCommand = kity.createClass('NoteCommand', {
            base: Command,

            execute: function (minder, note) {
                var node = minder.getSelectedNode();
                node.setData('note', note);
                node.render();
                node.getMinder().layout(300);
            },

            queryState: function (minder) {
                return minder.getSelectedNodes().length === 1 ? 0 : -1;
            },

            queryValue: function (minder) {
                var node = minder.getSelectedNode();
                return node && node.getData('note');
            }
        });

        var NoteIcon = kity.createClass('NoteIcon', {
            base: kity.Group,
            constructor: function () {
                this.callBase();
                this.width = 16;
                this.height = 17;
                this.rect = new kity.Rect(16, 17, 0.5, -8.5, 2).fill('transparent');
                this.path = new kity.Path()
                    .setAttr("name", "NoteIcon")
                    .setPathData(NOTE_PATH)
                    .fill('#666')
                    .setTranslate(-1.5, -11)
                    .setScale(0.021);
                this.addShapes([this.rect, this.path]);

                this.on('mouseover', function () {
                    this.rect.fill('rgba(255, 255, 200, .8)');
                }).on('mouseout', function () {
                    this.rect.fill('transparent');
                });

                this.setStyle('cursor', 'pointer');
            }
        });

        var NoteIconRenderer = kity.createClass('NoteIconRenderer', {
            base: Renderer,

            create: function (node) {
                var icon = new NoteIcon();
                icon.on('mousedown', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    node.getMinder().fire('editnoterequest', {event: e});
                });
                icon.on('mouseover', _.debounce(function (e) {
                    console.log('note.mouseover');
                    e.preventDefault();
                    e.stopPropagation();
                    node.getMinder().fire('shownoterequest', {node: node, icon: icon, event: e});
                }), 500);
                icon.on('mouseout', _.debounce(function (e) {
                    console.log('note.mouseover');
                    e.preventDefault();
                    e.stopPropagation();
                    node.getMinder().fire('hidenoterequest', {node: node, icon: icon, event: e});
                }, 500));
                return icon;
            },

            shouldRender: function (node) {
                return node.getData('note');
            },

            update: function (icon, node, box) {
                var x = box.right + node.getStyle('space-left');
                var y = box.cy;

                // icon.path.fill(node.getStyle('color'));
                icon.setTranslate(x, y);

                return new kity.Box(x, Math.round(y - icon.height / 2), icon.width, icon.height);
            }

        });

        return {
            renderers: {
                right: NoteIconRenderer
            },
            commands: {
                'note': NoteCommand
            }
        };
    });
});