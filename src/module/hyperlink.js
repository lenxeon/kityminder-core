define(function (require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    // jscs:disable maximumLineLength
    var linkShapePath = 'M511.999488 62.400189c-248.307296 0-449.599811 201.292516-449.599811 449.599811s201.292516 449.599811 449.599811 449.599811 449.599811-201.292516 449.599811-449.599811S760.306784 62.400189 511.999488 62.400189zM724.108351 536.267706 536.268218 724.107839c-31.568996 31.568996-73.541947 48.954969-118.188796 48.954969-44.644803 0-86.618776-17.385972-118.187773-48.954969-31.57002-31.57002-48.955992-73.54297-48.955992-118.189819 0-44.645826 17.386996-86.618776 48.955992-118.188796l78.643128-78.643128c44.030819-44.029796 115.673509-44.029796 159.702282 0 44.030819 44.029796 44.030819 115.672486 0 159.702282l-91.664699 91.665723c-10.232039 10.229992-26.819832 10.229992-37.051871 0-10.231015-10.232039-10.231015-26.819832 0-37.050848l91.665723-91.665723c23.600511-23.600511 23.600511-62.001099 0-85.600587-23.600511-23.600511-62.001099-23.600511-85.602633 0l-78.644151 78.643128c-44.73997 44.740994-44.73997 117.535927 0 162.27692 44.73997 44.73997 117.53695 44.73997 162.27692 0l187.840132-187.840132c44.738947-44.740994 44.738947-117.53695 0-162.275897-44.73997-44.740994-117.53695-44.73997-162.27692 0-10.229992 10.231015-26.818809 10.231015-37.050848 0-10.231015-10.232039-10.231015-26.819832 0-37.051871 31.568996-31.568996 73.543993-48.954969 118.187773-48.953945 44.647873 0 86.6198 17.384949 118.190843 48.953945 31.568996 31.571043 48.954969 73.543993 48.954969 118.189819S755.677347 504.69871 724.108351 536.267706z';

    Module.register('hyperlink', {
        'commands': {

            /**
             * @command HyperLink
             * @description 为选中的节点添加超链接
             * @param {string} url 超链接的 URL，设置为 null 移除
             * @param {string} title 超链接的说明
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 返回首个选中节点的超链接信息，JSON 对象： `{url: url, title: title}`
             */
            'hyperlink': kity.createClass('hyperlink', {
                base: Command,

                execute: function (km, url, title) {
                    var nodes = km.getSelectedNodes();
                    nodes.forEach(function (n) {
                        n.setData('hyperlink', url);
                        n.setData('hyperlinkTitle', url && title);
                        n.render();
                    });
                    km.layout();
                },
                queryState: function (km) {
                    var nodes = km.getSelectedNodes(),
                        result = 0;
                    if (nodes.length === 0) {
                        return -1;
                    }
                    nodes.forEach(function (n) {
                        if (n && n.getData('hyperlink')) {
                            result = 0;
                            return false;
                        }
                    });
                    return result;
                },
                queryValue: function (km) {
                    var node = km.getSelectedNode();
                    return {
                        url: node.getData('hyperlink'),
                        title: node.getData('hyperlinkTitle')
                    };
                }
            })
        },
        'renderers': {
            right: kity.createClass('hyperlinkrender', {
                base: Renderer,

                create: function () {

                    var link = new kity.HyperLink();
                    var linkshape = new kity.Path();
                    var outline = new kity.Rect(24, 22, -2, -6, 4).fill('rgba(255, 255, 255, 0)');
                    linkshape.scale(0.022, 0.022);//太大了，缩放一下
                    linkshape.translate(-1, -6);//

                    linkshape.setPathData(linkShapePath).fill('#666');
                    // linkshape.setAttribute('width', 20);//.setHeight(20)
                    link.addShape(outline);
                    link.addShape(linkshape);
                    link.setTarget('_blank');
                    link.setStyle('cursor', 'pointer');

                    // link.on('mouseover', function () {
                    //     outline.fill('rgba(255, 255, 200, .8)');
                    // }).on('mouseout', function () {
                    //     outline.fill('rgba(255, 255, 255, 0)');
                    // });
                    return link;
                },

                shouldRender: function (node) {
                    return node.getData('hyperlink');
                },

                update: function (link, node, box) {

                    var href = node.getData('hyperlink');
                    link.setHref('#');

                    var allowed = ['^http:', '^https:', '^ftp:', '^mailto:'];
                    for (var i = 0; i < allowed.length; i++) {
                        var regex = new RegExp(allowed[i]);
                        if (regex.test(href)) {
                            link.setHref(href);
                            break;
                        }
                    }
                    var title = node.getData('hyperlinkTitle');

                    if (title) {
                        title = [title, '(', href, ')'].join('');
                    } else {
                        title = href;
                    }

                    link.node.setAttributeNS('http://www.w3.org/1999/xlink', 'title', title);

                    var spaceRight = node.getStyle('space-right');

                    link.setTranslate(box.right + spaceRight + 2, -5);
                    return new kity.Box({
                        x: box.right + spaceRight,
                        y: -11,
                        width: 24,
                        height: 22
                    });
                }
            })
        }
    });
});