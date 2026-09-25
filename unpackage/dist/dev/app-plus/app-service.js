if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  const ON_LAUNCH = "onLaunch";
  const ON_LOAD = "onLoad";
  const ON_UNLOAD = "onUnload";
  const ON_BACK_PRESS = "onBackPress";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createLifeCycleHook = (lifecycle, flag = 0) => (hook, target = vue.getCurrentInstance()) => {
    if (vue.isInSSRComponentSetup)
      return;
    vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createLifeCycleHook(
    ON_SHOW,
    2
    /* HookFlags.PAGE */
  );
  const onLaunch = /* @__PURE__ */ createLifeCycleHook(
    ON_LAUNCH,
    1
    /* HookFlags.APP */
  );
  const onLoad = /* @__PURE__ */ createLifeCycleHook(
    ON_LOAD,
    2
    /* HookFlags.PAGE */
  );
  const onUnload = /* @__PURE__ */ createLifeCycleHook(
    ON_UNLOAD,
    2
    /* HookFlags.PAGE */
  );
  const onBackPress = /* @__PURE__ */ createLifeCycleHook(
    ON_BACK_PRESS,
    2
    /* HookFlags.PAGE */
  );
  const _imports_0 = "/static/logo.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$i = {
    __name: "TopBar",
    props: {
      modelValue: { type: String, default: "" },
      pendingCount: { type: Number, default: 0 }
    },
    emits: ["update:modelValue", "settings"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const searching = vue.ref(false);
      let statusBarHeight = 0;
      try {
        const info = uni.getSystemInfoSync();
        statusBarHeight = info.statusBarHeight || 0;
      } catch (e) {
        statusBarHeight = 0;
      }
      const topStyle = "padding-top:" + statusBarHeight + "px";
      function openSearch() {
        searching.value = true;
      }
      function onSettings() {
        emit("settings");
      }
      function closeSearch() {
        searching.value = false;
        emit("update:modelValue", "");
      }
      function onInput(e) {
        emit("update:modelValue", e.detail.value);
      }
      const __returned__ = { props, emit, searching, get statusBarHeight() {
        return statusBarHeight;
      }, set statusBarHeight(v) {
        statusBarHeight = v;
      }, topStyle, openSearch, onSettings, closeSearch, onInput, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "topbar",
      style: $setup.topStyle
    }, [
      !$setup.searching ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "row"
      }, [
        vue.createElementVNode("view", { class: "brand" }, [
          vue.createElementVNode("image", {
            class: "logo",
            src: _imports_0,
            mode: "aspectFit"
          }),
          vue.createElementVNode("text", { class: "title" }, "还有什么"),
          $props.pendingCount > 0 ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: "badge"
            },
            vue.toDisplayString($props.pendingCount),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "actions" }, [
          vue.createElementVNode("view", {
            class: "icon-btn",
            onClick: $setup.openSearch
          }, [
            vue.createElementVNode("view", { class: "glass" })
          ]),
          vue.createElementVNode("text", {
            class: "settings-btn",
            onClick: $setup.onSettings
          }, "设置")
        ])
      ])) : (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "row"
      }, [
        vue.createElementVNode("input", {
          class: "search-input",
          type: "text",
          value: $props.modelValue,
          placeholder: "搜索",
          "placeholder-class": "search-ph",
          "confirm-type": "search",
          focus: true,
          maxlength: 50,
          onInput: $setup.onInput
        }, null, 40, ["value"]),
        vue.createElementVNode("text", {
          class: "cancel",
          onClick: $setup.closeSearch
        }, "取消")
      ]))
    ]);
  }
  const TopBar = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-32d0c71d"], ["__file", "D:/软件开发/whatelse-todo/components/TopBar.vue"]]);
  const _sfc_main$h = {
    __name: "QuickAdd",
    props: {
      modelValue: { type: String, default: "" }
    },
    emits: ["update:modelValue", "submit"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function onInput(e) {
        emit("update:modelValue", e.detail.value);
      }
      function onConfirm(e) {
        emit("submit", e.detail.value);
      }
      const __returned__ = { props, emit, onInput, onConfirm };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "quick-add" }, [
      vue.createElementVNode("input", {
        class: "input",
        type: "text",
        value: $props.modelValue,
        placeholder: "还有什么要做的？",
        "placeholder-class": "ph",
        "confirm-type": "done",
        "confirm-hold": true,
        maxlength: 200,
        onInput: $setup.onInput,
        onConfirm: $setup.onConfirm
      }, null, 40, ["value"])
    ]);
  }
  const QuickAdd = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-3165a7b6"], ["__file", "D:/软件开发/whatelse-todo/components/QuickAdd.vue"]]);
  const _sfc_main$g = {
    __name: "CategoryFilter",
    props: {
      items: { type: Array, default: function() {
        return [];
      } },
      current: { type: String, default: "all" }
    },
    emits: ["change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function onPick(id) {
        if (id === props.current)
          return;
        emit("change", id);
      }
      const __returned__ = { props, emit, onPick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("scroll-view", {
      class: "filter",
      "scroll-x": "",
      "show-scrollbar": false
    }, [
      vue.createElementVNode("view", { class: "row" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($props.items, (item) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: item.id,
              class: vue.normalizeClass(["tab", { on: item.id === $props.current }]),
              onClick: ($event) => $setup.onPick(item.id)
            }, [
              vue.createElementVNode(
                "text",
                { class: "name" },
                vue.toDisplayString(item.name),
                1
                /* TEXT */
              )
            ], 10, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const CategoryFilter = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-e2bdaf35"], ["__file", "D:/软件开发/whatelse-todo/components/CategoryFilter.vue"]]);
  const DAY_MS = 24 * 60 * 60 * 1e3;
  function pad2(n) {
    return n < 10 ? "0" + n : "" + n;
  }
  function startOfDay(ts) {
    const d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  function isOverdue(ts) {
    if (!ts)
      return false;
    return ts < Date.now();
  }
  function formatRemind(ts) {
    if (!ts)
      return "";
    const now = Date.now();
    const diffDays = Math.round((startOfDay(ts) - startOfDay(now)) / DAY_MS);
    const d = new Date(ts);
    const hm = pad2(d.getHours()) + ":" + pad2(d.getMinutes());
    if (diffDays === 0)
      return "今天 " + hm;
    if (diffDays === 1)
      return "明天 " + hm;
    if (diffDays === -1)
      return "昨天 " + hm;
    if (d.getFullYear() === new Date(now).getFullYear()) {
      return d.getMonth() + 1 + "月" + d.getDate() + "日 " + hm;
    }
    return d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日 " + hm;
  }
  const DIR_THRESHOLD = 6;
  const _sfc_main$f = {
    __name: "TaskItem",
    props: {
      task: { type: Object, required: true },
      category: { type: Object, default: null }
    },
    emits: ["toggle", "edit", "remove"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const openRow = { id: "" };
      const OPEN_WIDTH = uni.upx2px(140);
      const dragging = vue.ref(false);
      const offset = vue.ref(0);
      let startX = 0;
      let startY = 0;
      let startOffset = 0;
      let axis = null;
      const contentStyle = vue.computed(function() {
        const base = "transform: translateX(" + offset.value + "px);";
        return dragging.value ? base : base + " transition: transform 0.2s ease;";
      });
      function onTouchStart(e) {
        if (!e.touches || !e.touches.length)
          return;
        if (openRow.id && openRow.id !== props.task.id) {
          offset.value = 0;
          openRow.id = "";
        }
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        startOffset = offset.value;
        axis = null;
      }
      function onTouchMove(e) {
        if (!e.touches || !e.touches.length)
          return;
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        if (axis === null) {
          if (Math.abs(dx) < DIR_THRESHOLD && Math.abs(dy) < DIR_THRESHOLD)
            return;
          axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
        }
        if (axis === "v")
          return;
        dragging.value = true;
        let next = startOffset + dx;
        if (next > OPEN_WIDTH)
          next = OPEN_WIDTH;
        if (next < -OPEN_WIDTH)
          next = -OPEN_WIDTH;
        offset.value = next;
      }
      function onTouchEnd() {
        if (axis === "h") {
          if (offset.value > OPEN_WIDTH / 2) {
            offset.value = 0;
            openRow.id = "";
            emit("toggle", props.task);
          } else if (offset.value < -OPEN_WIDTH / 2) {
            offset.value = -OPEN_WIDTH;
            openRow.id = props.task.id;
          } else {
            offset.value = 0;
            openRow.id = "";
          }
        }
        dragging.value = false;
        axis = null;
      }
      function collapse() {
        offset.value = 0;
        openRow.id = "";
      }
      function onTap() {
        if (offset.value !== 0) {
          collapse();
          return;
        }
        emit("edit", props.task);
      }
      function onToggle() {
        if (offset.value !== 0) {
          collapse();
          return;
        }
        emit("toggle", props.task);
      }
      function onComplete() {
        collapse();
        emit("toggle", props.task);
      }
      function onDelete() {
        collapse();
        emit("remove", props.task);
      }
      const overdue = vue.computed(function() {
        return !props.task.done && !!props.task.remindAt && isOverdue(props.task.remindAt);
      });
      const remindText = vue.computed(function() {
        return props.task.remindAt ? formatRemind(props.task.remindAt) : "";
      });
      const dueText = vue.computed(function() {
        return props.task.dueAt ? "截止 " + formatRemind(props.task.dueAt) : "";
      });
      const imageText = vue.computed(function() {
        const n = (props.task.images || []).length;
        return n ? "🖼️ " + n : "";
      });
      const hasMeta = vue.computed(function() {
        return !!(props.category || remindText.value || dueText.value || imageText.value);
      });
      const __returned__ = { props, emit, openRow, OPEN_WIDTH, DIR_THRESHOLD, dragging, offset, get startX() {
        return startX;
      }, set startX(v) {
        startX = v;
      }, get startY() {
        return startY;
      }, set startY(v) {
        startY = v;
      }, get startOffset() {
        return startOffset;
      }, set startOffset(v) {
        startOffset = v;
      }, get axis() {
        return axis;
      }, set axis(v) {
        axis = v;
      }, contentStyle, onTouchStart, onTouchMove, onTouchEnd, collapse, onTap, onToggle, onComplete, onDelete, overdue, remindText, dueText, imageText, hasMeta, ref: vue.ref, computed: vue.computed, get formatRemind() {
        return formatRemind;
      }, get isOverdue() {
        return isOverdue;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "task-row" }, [
      vue.createElementVNode("view", { class: "done-layer" }, [
        vue.createElementVNode("view", {
          class: "done-btn",
          onClick: $setup.onComplete
        }, [
          vue.createElementVNode(
            "text",
            { class: "done-text" },
            vue.toDisplayString($props.task.done ? "取消" : "完成"),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "delete-layer" }, [
        vue.createElementVNode("view", {
          class: "delete-btn",
          onClick: $setup.onDelete
        }, [
          vue.createElementVNode("text", { class: "delete-text" }, "删除")
        ])
      ]),
      vue.createElementVNode(
        "view",
        {
          class: "content",
          style: vue.normalizeStyle($setup.contentStyle),
          onTouchstart: vue.withModifiers($setup.onTouchStart, ["stop"]),
          onTouchmove: vue.withModifiers($setup.onTouchMove, ["stop"]),
          onTouchend: vue.withModifiers($setup.onTouchEnd, ["stop"]),
          onClick: $setup.onTap
        },
        [
          vue.createElementVNode("view", {
            class: "check-wrap",
            onClick: vue.withModifiers($setup.onToggle, ["stop"])
          }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["check", { done: $props.task.done, overdue: $setup.overdue }])
              },
              [
                $props.task.done ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "tick"
                })) : vue.createCommentVNode("v-if", true)
              ],
              2
              /* CLASS */
            )
          ]),
          vue.createElementVNode("view", { class: "body" }, [
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["title ellipsis", { done: $props.task.done }])
              },
              vue.toDisplayString($props.task.title),
              3
              /* TEXT, CLASS */
            ),
            $setup.hasMeta ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "meta"
            }, [
              $props.category && $props.category.color ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 0,
                  class: "dot",
                  style: vue.normalizeStyle({ backgroundColor: $props.category.color })
                },
                null,
                4
                /* STYLE */
              )) : vue.createCommentVNode("v-if", true),
              $setup.remindText ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 1,
                  class: vue.normalizeClass(["meta-text", { "meta-warn": $setup.overdue && !$props.task.done }])
                },
                vue.toDisplayString($setup.remindText),
                3
                /* TEXT, CLASS */
              )) : vue.createCommentVNode("v-if", true),
              $setup.dueText ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 2,
                  class: "meta-text"
                },
                vue.toDisplayString($setup.dueText),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true),
              $setup.imageText ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 3,
                  class: "meta-text"
                },
                vue.toDisplayString($setup.imageText),
                1
                /* TEXT */
              )) : vue.createCommentVNode("v-if", true)
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ],
        36
        /* STYLE, NEED_HYDRATION */
      )
    ]);
  }
  const TaskItem = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-77ed7f2e"], ["__file", "D:/软件开发/whatelse-todo/components/TaskItem.vue"]]);
  const _sfc_main$e = {
    __name: "GroupHeader",
    props: {
      count: { type: Number, default: 0 },
      collapsed: { type: Boolean, default: true }
    },
    emits: ["toggle"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function onToggle() {
        emit("toggle");
      }
      const __returned__ = { props, emit, onToggle };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "group",
      onClick: $setup.onToggle
    }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["arrow", { open: !$props.collapsed }])
        },
        null,
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "text",
        { class: "label" },
        "已完成（" + vue.toDisplayString($props.count) + "）",
        1
        /* TEXT */
      )
    ]);
  }
  const GroupHeader = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-fe515197"], ["__file", "D:/软件开发/whatelse-todo/components/GroupHeader.vue"]]);
  const _sfc_main$d = {
    __name: "TaskList",
    props: {
      active: { type: Array, default: function() {
        return [];
      } },
      completed: { type: Array, default: function() {
        return [];
      } },
      collapsed: { type: Boolean, default: true },
      categories: { type: Array, default: function() {
        return [];
      } }
    },
    emits: ["toggle", "edit", "remove", "toggle-group"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function categoryOf(id) {
        return props.categories.find(function(c) {
          return c.id === id;
        }) || null;
      }
      function onToggle(task) {
        emit("toggle", task);
      }
      function onEdit(task) {
        emit("edit", task);
      }
      function onRemove(task) {
        emit("remove", task);
      }
      function onToggleGroup() {
        emit("toggle-group");
      }
      const __returned__ = { props, emit, categoryOf, onToggle, onEdit, onRemove, onToggleGroup, TaskItem, GroupHeader };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "list" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.active, (t) => {
          return vue.openBlock(), vue.createBlock($setup["TaskItem"], {
            key: t.id,
            task: t,
            category: $setup.categoryOf(t.categoryId),
            onToggle: $setup.onToggle,
            onEdit: $setup.onEdit,
            onRemove: $setup.onRemove
          }, null, 8, ["task", "category"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      $props.completed.length ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createVNode($setup["GroupHeader"], {
          count: $props.completed.length,
          collapsed: $props.collapsed,
          onToggle: $setup.onToggleGroup
        }, null, 8, ["count", "collapsed"]),
        !$props.collapsed ? (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          { key: 0 },
          vue.renderList($props.completed, (t) => {
            return vue.openBlock(), vue.createBlock($setup["TaskItem"], {
              key: t.id,
              task: t,
              category: $setup.categoryOf(t.categoryId),
              onToggle: $setup.onToggle,
              onEdit: $setup.onEdit,
              onRemove: $setup.onRemove
            }, null, 8, ["task", "category"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )) : vue.createCommentVNode("v-if", true)
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const TaskList = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-af126484"], ["__file", "D:/软件开发/whatelse-todo/components/TaskList.vue"]]);
  const _sfc_main$c = {
    __name: "EmptyState",
    props: {
      art: { type: String, default: "🌱" },
      title: { type: String, default: "没有别的了" },
      hint: { type: String, default: "" }
    },
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = {};
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "empty" }, [
      vue.createElementVNode(
        "text",
        { class: "art" },
        vue.toDisplayString($props.art),
        1
        /* TEXT */
      ),
      vue.createElementVNode(
        "text",
        { class: "main" },
        vue.toDisplayString($props.title),
        1
        /* TEXT */
      ),
      $props.hint ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 0,
          class: "hint"
        },
        vue.toDisplayString($props.hint),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const EmptyState = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-3454b0cd"], ["__file", "D:/软件开发/whatelse-todo/components/EmptyState.vue"]]);
  const _sfc_main$b = {
    __name: "FabButton",
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit = __emit;
      function onClick() {
        emit("click");
      }
      const __returned__ = { emit, onClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "fab",
      onClick: $setup.onClick
    }, [
      vue.createElementVNode("view", { class: "plus-h" }),
      vue.createElementVNode("view", { class: "plus-v" })
    ]);
  }
  const FabButton = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-a1750c8d"], ["__file", "D:/软件开发/whatelse-todo/components/FabButton.vue"]]);
  const KEY_TASKS = "whatelse_tasks";
  const KEY_CATEGORIES = "whatelse_categories";
  const KEY_SETTINGS = "whatelse_settings";
  const KEY_SCHEMA_VERSION = "whatelse_schema_version";
  const KEY_BACKUP_PREFIX = "whatelse_backup_v";
  const SCHEMA_VERSION = 1;
  const CHANNEL_ID = "whatelse_default";
  const NOTIFY_TITLE = "还有什么";
  const CATEGORY_DEFAULT = "default";
  const STATUS_ALL = "all";
  const STATUS_ACTIVE = "active";
  const STATUS_COMPLETED = "completed";
  const SORT_BY_CREATED = "created";
  const SORT_BY_REMIND = "remind";
  const THEME_LIGHT = "light";
  const THEME_DARK = "dark";
  const REMIND_WINDOW_MS = 7 * 24 * 60 * 60 * 1e3;
  const MISSED_WINDOW_MS = 24 * 60 * 60 * 1e3;
  const DEFAULT_CATEGORIES = [
    { id: "default", name: "默认", color: "#8A8F99", builtin: true, sort: 0 },
    { id: "work", name: "工作", color: "#3A7AFE", builtin: true, sort: 1 },
    { id: "life", name: "生活", color: "#34C759", builtin: true, sort: 2 },
    { id: "study", name: "学习", color: "#FF9500", builtin: true, sort: 3 }
  ];
  const DEFAULT_SETTINGS = {
    theme: "system",
    sortBy: "created",
    completedCollapsed: true,
    filterCategoryId: "all",
    notifyGuideDismissed: false,
    lastReorderAt: 0
  };
  const EXPORT_APP_ID = "whatelse";
  const MAX_IMAGES = 9;
  const CATEGORY_COLORS = [
    "#3A7AFE",
    "#34C759",
    "#FF9500",
    "#FF3B30",
    "#AF52DE",
    "#5AC8FA",
    "#FF2D55",
    "#8A8F99"
  ];
  function loadTasks() {
    const v = uni.getStorageSync(KEY_TASKS);
    return Array.isArray(v) ? v : [];
  }
  function saveTasks(tasks) {
    uni.setStorageSync(KEY_TASKS, Array.isArray(tasks) ? tasks : []);
  }
  function loadCategories() {
    const v = uni.getStorageSync(KEY_CATEGORIES);
    return Array.isArray(v) ? v : [];
  }
  function saveCategories(list) {
    uni.setStorageSync(KEY_CATEGORIES, Array.isArray(list) ? list : []);
  }
  function loadSettings() {
    const v = uni.getStorageSync(KEY_SETTINGS);
    const s = v && typeof v === "object" && !Array.isArray(v) ? v : {};
    return Object.assign({}, DEFAULT_SETTINGS, s);
  }
  function saveSettings(patch) {
    const next = Object.assign({}, loadSettings(), patch || {});
    uni.setStorageSync(KEY_SETTINGS, next);
    return next;
  }
  function initStorage() {
    if (!loadCategories().length) {
      saveCategories(DEFAULT_CATEGORIES.map(function(c) {
        return Object.assign({}, c);
      }));
    }
    if (!uni.getStorageSync(KEY_SETTINGS)) {
      saveSettings({});
    }
    if (!uni.getStorageSync(KEY_SCHEMA_VERSION)) {
      uni.setStorageSync(KEY_SCHEMA_VERSION, SCHEMA_VERSION);
    }
  }
  const MIGRATIONS = {
    // 2: function (data) { data.tasks.forEach(function (t) { t.priority = 0 }); return data }
  };
  function migrateIfNeeded() {
    const current = parseInt(uni.getStorageSync(KEY_SCHEMA_VERSION), 10) || 0;
    if (current >= SCHEMA_VERSION)
      return;
    if (current === 0) {
      uni.setStorageSync(KEY_SCHEMA_VERSION, SCHEMA_VERSION);
      return;
    }
    const backupKey = KEY_BACKUP_PREFIX + current;
    if (!uni.getStorageSync(backupKey)) {
      uni.setStorageSync(backupKey, {
        tasks: loadTasks(),
        categories: loadCategories(),
        settings: loadSettings(),
        backedUpAt: Date.now()
      });
    }
    let data = {
      tasks: loadTasks(),
      categories: loadCategories(),
      settings: loadSettings()
    };
    for (let v = current + 1; v <= SCHEMA_VERSION; v++) {
      const fn = MIGRATIONS[v];
      if (typeof fn === "function") {
        data = fn(data) || data;
      }
    }
    saveTasks(data.tasks || []);
    saveCategories(data.categories || []);
    saveSettings(data.settings || {});
    uni.setStorageSync(KEY_SCHEMA_VERSION, SCHEMA_VERSION);
  }
  function replaceAll(payload) {
    const p = payload || {};
    saveTasks(p.tasks || []);
    saveCategories(p.categories || []);
    saveSettings(p.settings || {});
  }
  function getSettings() {
    return loadSettings();
  }
  function updateSettings(patch) {
    return saveSettings(patch || {});
  }
  function resolveTheme(setting, systemTheme2) {
    if (setting === THEME_LIGHT || setting === THEME_DARK)
      return setting;
    return systemTheme2 === "dark" ? THEME_DARK : THEME_LIGHT;
  }
  function themeClass(setting, systemTheme2) {
    return resolveTheme(setting, systemTheme2) === THEME_DARK ? "theme-dark" : "theme-light";
  }
  function themeLabel(setting) {
    if (setting === THEME_LIGHT)
      return "浅色";
    if (setting === THEME_DARK)
      return "深色";
    return "跟随系统";
  }
  function sortLabel(sortBy) {
    return sortBy === "remind" ? "按提醒时间" : "按创建时间";
  }
  function systemTheme() {
    try {
      const info = uni.getSystemInfoSync();
      return info && info.theme ? info.theme : "light";
    } catch (e) {
      return "light";
    }
  }
  const themeCls = vue.ref("theme-light");
  let inited = false;
  function applyTheme() {
    themeCls.value = themeClass(getSettings().theme, systemTheme());
    try {
      plus.navigator.setStatusBarStyle(themeCls.value === "theme-dark" ? "light" : "dark");
    } catch (e) {
    }
  }
  function useTheme() {
    if (!inited) {
      inited = true;
      applyTheme();
      if (typeof uni.onThemeChange === "function") {
        uni.onThemeChange(function(res) {
          if (getSettings().theme === "system") {
            themeCls.value = themeClass("system", res && res.theme);
          }
        });
      }
    } else {
      applyTheme();
    }
    return { themeCls, applyTheme };
  }
  function genId$1() {
    return "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  }
  function normalizeName(v) {
    return String(v == null ? "" : v).trim().slice(0, 8);
  }
  function listCategories() {
    const list = loadCategories();
    if (!list.length) {
      const seed = DEFAULT_CATEGORIES.map(function(c) {
        return Object.assign({}, c);
      });
      saveCategories(seed);
      return seed;
    }
    return list.slice().sort(function(a, b) {
      return (a.sort || 0) - (b.sort || 0);
    });
  }
  function createCategory(input) {
    const d = input || {};
    const name = normalizeName(d.name);
    if (!name)
      return null;
    const list = listCategories();
    const dup = list.some(function(c) {
      return c.name === name;
    });
    if (dup)
      return null;
    let maxSort = 0;
    list.forEach(function(c) {
      maxSort = Math.max(maxSort, c.sort || 0);
    });
    const cat = {
      id: genId$1(),
      name,
      color: d.color || "#3A7AFE",
      builtin: false,
      sort: maxSort + 1
    };
    list.push(cat);
    saveCategories(list);
    return cat;
  }
  function updateCategory(id, patch) {
    const list = listCategories();
    const idx = list.findIndex(function(c) {
      return c.id === id;
    });
    if (idx < 0)
      return null;
    const p = patch || {};
    const next = Object.assign({}, list[idx]);
    if (p.name !== void 0) {
      const name = normalizeName(p.name);
      if (!name)
        return null;
      const dup = list.some(function(c) {
        return c.id !== id && c.name === name;
      });
      if (dup)
        return null;
      next.name = name;
    }
    if (p.color !== void 0)
      next.color = p.color;
    list[idx] = next;
    saveCategories(list);
    return next;
  }
  function removeCategory(id) {
    if (id === CATEGORY_DEFAULT)
      return -1;
    const list = listCategories();
    const idx = list.findIndex(function(c) {
      return c.id === id;
    });
    if (idx < 0)
      return -1;
    const tasks = loadTasks();
    let moved = 0;
    tasks.forEach(function(t) {
      if (t.categoryId === id) {
        t.categoryId = CATEGORY_DEFAULT;
        moved++;
      }
    });
    if (moved > 0)
      saveTasks(tasks);
    list.splice(idx, 1);
    saveCategories(list);
    return moved;
  }
  function countTasksIn(id) {
    return loadTasks().filter(function(t) {
      return t.categoryId === id;
    }).length;
  }
  function genId() {
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
  }
  function normalizeTitle(v) {
    return String(v == null ? "" : v).trim().slice(0, 200);
  }
  function normalizeNote(v) {
    return String(v == null ? "" : v).trim().slice(0, 500);
  }
  function normalizeTs(v) {
    return typeof v === "number" && !isNaN(v) ? v : null;
  }
  function normalizeImages(v) {
    if (!Array.isArray(v))
      return [];
    const out = [];
    v.forEach(function(p) {
      if (typeof p === "string" && p && out.indexOf(p) < 0 && out.length < MAX_IMAGES) {
        out.push(p);
      }
    });
    return out;
  }
  function createTask(input) {
    const d = input || {};
    const title = normalizeTitle(d.title);
    if (!title)
      return null;
    const list = loadTasks();
    let now = Date.now();
    let maxCreated = 0;
    list.forEach(function(t) {
      if (t.createdAt > maxCreated)
        maxCreated = t.createdAt;
    });
    if (now <= maxCreated)
      now = maxCreated + 1;
    const task = {
      id: genId(),
      title,
      note: normalizeNote(d.note),
      images: normalizeImages(d.images),
      done: false,
      categoryId: d.categoryId || CATEGORY_DEFAULT,
      remindAt: normalizeTs(d.remindAt),
      dueAt: normalizeTs(d.dueAt),
      createdAt: now,
      updatedAt: now,
      completedAt: null,
      sort: now
    };
    list.push(task);
    saveTasks(list);
    return task;
  }
  function updateTask(id, patch) {
    const list = loadTasks();
    const idx = list.findIndex(function(t) {
      return t.id === id;
    });
    if (idx < 0)
      return null;
    const p = patch || {};
    const next = Object.assign({}, list[idx]);
    if (p.title !== void 0) {
      const t = normalizeTitle(p.title);
      if (!t)
        return null;
      next.title = t;
    }
    if (p.note !== void 0)
      next.note = normalizeNote(p.note);
    if (p.images !== void 0)
      next.images = normalizeImages(p.images);
    if (p.categoryId !== void 0)
      next.categoryId = p.categoryId || CATEGORY_DEFAULT;
    if (p.remindAt !== void 0)
      next.remindAt = normalizeTs(p.remindAt);
    if (p.dueAt !== void 0)
      next.dueAt = normalizeTs(p.dueAt);
    next.updatedAt = Date.now();
    list[idx] = next;
    saveTasks(list);
    return next;
  }
  function removeTask(id) {
    const list = loadTasks();
    const idx = list.findIndex(function(t) {
      return t.id === id;
    });
    if (idx < 0)
      return null;
    const removed = list.splice(idx, 1)[0];
    saveTasks(list);
    return removed;
  }
  function restoreTask(task) {
    if (!task || !task.id)
      return null;
    const list = loadTasks();
    const exists = list.some(function(t) {
      return t.id === task.id;
    });
    if (exists)
      return null;
    list.push(task);
    saveTasks(list);
    return task;
  }
  function toggleDone(id) {
    const list = loadTasks();
    const idx = list.findIndex(function(t2) {
      return t2.id === id;
    });
    if (idx < 0)
      return null;
    const t = Object.assign({}, list[idx]);
    t.done = !t.done;
    t.completedAt = t.done ? Date.now() : null;
    t.updatedAt = Date.now();
    list[idx] = t;
    saveTasks(list);
    const remaining = list.filter(function(x) {
      return !x.done;
    }).length;
    return { task: t, remaining };
  }
  function getTaskById(id) {
    const list = loadTasks();
    return list.find(function(t) {
      return t.id === id;
    }) || null;
  }
  function queryTasks(options) {
    const o = options || {};
    const keyword = String(o.keyword || "").trim().toLowerCase();
    const categoryId = o.categoryId || "all";
    const status = o.status || STATUS_ALL;
    const sortBy = o.sortBy || SORT_BY_CREATED;
    let list = loadTasks();
    if (categoryId && categoryId !== "all") {
      list = list.filter(function(t) {
        return t.categoryId === categoryId;
      });
    }
    if (status === STATUS_ACTIVE) {
      list = list.filter(function(t) {
        return !t.done;
      });
    } else if (status === STATUS_COMPLETED) {
      list = list.filter(function(t) {
        return t.done;
      });
    }
    if (keyword) {
      list = list.filter(function(t) {
        return String(t.title || "").toLowerCase().indexOf(keyword) >= 0 || String(t.note || "").toLowerCase().indexOf(keyword) >= 0;
      });
    }
    if (sortBy === SORT_BY_REMIND) {
      list.sort(function(a, b) {
        const av = a.remindAt || Number.MAX_SAFE_INTEGER;
        const bv = b.remindAt || Number.MAX_SAFE_INTEGER;
        if (av !== bv)
          return av - bv;
        return b.createdAt - a.createdAt;
      });
    } else {
      list.sort(function(a, b) {
        return b.createdAt - a.createdAt;
      });
    }
    return list;
  }
  function groupTasks(list) {
    const src = Array.isArray(list) ? list : [];
    return {
      active: src.filter(function(t) {
        return !t.done;
      }),
      completed: src.filter(function(t) {
        return t.done;
      })
    };
  }
  function canNotify() {
    return typeof uni !== "undefined" && typeof uni.createPushMessage === "function";
  }
  function getScheduledMap() {
    const s = getSettings();
    const m = s.scheduledMap;
    return m && typeof m === "object" && !Array.isArray(m) ? m : {};
  }
  function markScheduled(taskId, remindAt) {
    const m = getScheduledMap();
    m[taskId] = remindAt;
    updateSettings({ scheduledMap: m });
  }
  function scheduleTask(task) {
    if (!task || !task.remindAt || task.done)
      return false;
    if (!canNotify())
      return false;
    const delta = task.remindAt - Date.now();
    if (delta < 0)
      return false;
    if (delta > REMIND_WINDOW_MS)
      return false;
    if (getScheduledMap()[task.id] === task.remindAt)
      return false;
    try {
      uni.createPushMessage({
        title: NOTIFY_TITLE,
        content: task.title,
        payload: { taskId: task.id },
        sound: "system",
        cover: false,
        delay: Math.round(delta / 1e3),
        // 注意：单位是秒
        when: new Date(task.remindAt),
        channelId: CHANNEL_ID
      });
      markScheduled(task.id, task.remindAt);
      return true;
    } catch (e) {
      formatAppLog("warn", "at common/notify.js:76", "[notify] 安排提醒失败", task.id, e);
      return false;
    }
  }
  function cancelTask(taskId) {
    return true;
  }
  function scheduleAll() {
    if (!canNotify())
      return 0;
    const list = queryTasks({ status: "active" });
    const activeIds = {};
    list.forEach(function(t) {
      activeIds[t.id] = true;
    });
    const m = getScheduledMap();
    let cleaned = false;
    Object.keys(m).forEach(function(id) {
      if (!activeIds[id]) {
        delete m[id];
        cleaned = true;
      }
    });
    if (cleaned)
      updateSettings({ scheduledMap: m });
    let count = 0;
    list.forEach(function(t) {
      if (scheduleTask(t))
        count++;
    });
    return count;
  }
  function rescheduleMissed() {
    if (!canNotify())
      return 0;
    const now = Date.now();
    const since = getSettings().lastReorderAt || 0;
    const list = queryTasks({ status: "active" });
    let count = 0;
    list.forEach(function(t) {
      if (!t.remindAt)
        return;
      if (t.remindAt > now)
        return;
      if (now - t.remindAt > MISSED_WINDOW_MS)
        return;
      if (t.remindAt <= since)
        return;
      try {
        uni.createPushMessage({
          title: NOTIFY_TITLE,
          content: t.title,
          payload: { taskId: t.id },
          sound: "system",
          cover: false,
          channelId: CHANNEL_ID
        });
        count++;
      } catch (e) {
        formatAppLog("warn", "at common/notify.js:157", "[notify] 补发提醒失败", t.id, e);
      }
    });
    updateSettings({ lastReorderAt: now });
    return count;
  }
  function ensureChannel() {
    try {
      if (typeof uni.getChannelManager !== "function")
        return false;
      const manager = uni.getChannelManager();
      if (!manager || typeof manager.setPushChannel !== "function")
        return false;
      if (typeof manager.getAllChannels === "function") {
        const existing = manager.getAllChannels();
        if (Array.isArray(existing) && existing.indexOf(CHANNEL_ID) >= 0)
          return true;
      }
      manager.setPushChannel({
        channelId: CHANNEL_ID,
        channelDesc: "任务提醒",
        importance: 4,
        enableVibration: true,
        enableLights: false
      });
      return true;
    } catch (e) {
      formatAppLog("warn", "at common/notify.js:193", "[notify] 创建通知渠道失败", e);
      return false;
    }
  }
  function refreshAll() {
    const missed = rescheduleMissed();
    const scheduled = scheduleAll();
    return { missed, scheduled };
  }
  function chooseImages(count) {
    return new Promise(function(resolve) {
      uni.chooseImage({
        count: count || MAX_IMAGES,
        sizeType: ["compressed"],
        // 用压缩过的图，别把原图塞进来
        sourceType: ["album", "camera"],
        success: function(res) {
          resolve(res.tempFilePaths || []);
        },
        fail: function() {
          resolve([]);
        }
      });
    });
  }
  function persistImages(tempPaths) {
    const list = Array.isArray(tempPaths) ? tempPaths : [];
    return Promise.all(list.map(function(p) {
      return new Promise(function(resolve) {
        uni.saveFile({
          tempFilePath: p,
          success: function(res) {
            resolve(res.savedFilePath);
          },
          fail: function() {
            resolve("");
          }
        });
      });
    })).then(function(paths) {
      return paths.filter(function(p) {
        return !!p;
      });
    });
  }
  function addImages(count) {
    return chooseImages(count).then(function(temps) {
      if (!temps.length)
        return [];
      return persistImages(temps);
    });
  }
  function removeImages(paths) {
    const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean);
    if (!list.length)
      return Promise.resolve(0);
    return Promise.all(list.map(function(p) {
      return new Promise(function(resolve) {
        uni.removeSavedFile({
          filePath: p,
          complete: function() {
            resolve(true);
          }
        });
      });
    })).then(function() {
      return list.length;
    });
  }
  function previewImages(paths, current) {
    const list = (Array.isArray(paths) ? paths : [paths]).filter(Boolean);
    if (!list.length)
      return;
    uni.previewImage({
      urls: list,
      current: current || list[0]
    });
  }
  const _sfc_main$a = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeCls: themeCls2, applyTheme: applyTheme2 } = useTheme();
      const keyword = vue.ref("");
      const draft = vue.ref("");
      const filterId = vue.ref("all");
      const categories = vue.ref([]);
      const collapsed = vue.ref(true);
      const tasks = vue.ref([]);
      const totalCount = vue.ref(0);
      const remainingCount = vue.ref(0);
      const undoVisible = vue.ref(false);
      let pendingUndo = null;
      let undoTimer = null;
      const filterItems = vue.computed(function() {
        return [{ id: "all", name: "全部" }].concat(categories.value);
      });
      const grouped = vue.computed(function() {
        return groupTasks(tasks.value);
      });
      const isEmptyAll = vue.computed(function() {
        return totalCount.value === 0;
      });
      const isEmptyFiltered = vue.computed(function() {
        return !isEmptyAll.value && tasks.value.length === 0;
      });
      const emptyFilteredTitle = vue.computed(function() {
        return keyword.value ? "没找到相关的" : "这个分类下暂时没有";
      });
      function refresh() {
        const s = getSettings();
        categories.value = listCategories();
        let fid = s.filterCategoryId || "all";
        if (fid !== "all" && !categories.value.some(function(c) {
          return c.id === fid;
        })) {
          fid = "all";
          updateSettings({ filterCategoryId: "all" });
        }
        filterId.value = fid;
        collapsed.value = s.completedCollapsed !== false;
        tasks.value = queryTasks({
          keyword: keyword.value,
          categoryId: fid,
          status: "all",
          sortBy: s.sortBy
        });
        const all = queryTasks({ status: "all" });
        totalCount.value = all.length;
        let rem = 0;
        all.forEach(function(t) {
          if (!t.done)
            rem++;
        });
        remainingCount.value = rem;
      }
      onShow(function() {
        applyTheme2();
        refresh();
      });
      onUnload(function() {
        if (undoTimer)
          clearTimeout(undoTimer);
      });
      vue.watch(keyword, function() {
        refresh();
      });
      function onQuickAdd(text) {
        const target = filterId.value === "all" ? "default" : filterId.value;
        const task = createTask({ title: text, categoryId: target });
        if (!task) {
          uni.showToast({ title: "内容不能为空", icon: "none" });
          return;
        }
        draft.value = "";
        refresh();
      }
      function onToggle(task) {
        const r = toggleDone(task.id);
        if (!r)
          return;
        if (typeof uni.vibrateShort === "function") {
          try {
            uni.vibrateShort({ fail: function() {
            } });
          } catch (e) {
          }
        }
        if (r.task.done) {
          cancelTask(task.id);
        } else {
          scheduleTask(r.task);
        }
        refresh();
        uni.showToast({
          title: r.remaining === 0 ? "没有别的了" : "还剩 " + r.remaining + " 件",
          icon: "none",
          duration: 1500
        });
      }
      function onRemove(task) {
        const removed = removeTask(task.id);
        if (!removed)
          return;
        cancelTask(task.id);
        refresh();
        pendingUndo = removed;
        undoVisible.value = true;
        if (undoTimer)
          clearTimeout(undoTimer);
        undoTimer = setTimeout(function() {
          if (pendingUndo && pendingUndo.images && pendingUndo.images.length) {
            removeImages(pendingUndo.images);
          }
          undoVisible.value = false;
          pendingUndo = null;
        }, 5e3);
      }
      function onUndo() {
        if (pendingUndo) {
          restoreTask(pendingUndo);
          scheduleTask(pendingUndo);
          pendingUndo = null;
        }
        undoVisible.value = false;
        if (undoTimer)
          clearTimeout(undoTimer);
        refresh();
      }
      function onEdit(task) {
        uni.navigateTo({ url: "/pages/task/edit?id=" + task.id });
      }
      function onFab() {
        uni.navigateTo({ url: "/pages/task/edit" });
      }
      function onSettings() {
        uni.navigateTo({ url: "/pages/settings/settings" });
      }
      function onToggleGroup() {
        collapsed.value = !collapsed.value;
        updateSettings({ completedCollapsed: collapsed.value });
      }
      function onFilterChange(id) {
        filterId.value = id;
        updateSettings({ filterCategoryId: id });
        refresh();
      }
      const __returned__ = { themeCls: themeCls2, applyTheme: applyTheme2, keyword, draft, filterId, categories, collapsed, tasks, totalCount, remainingCount, undoVisible, get pendingUndo() {
        return pendingUndo;
      }, set pendingUndo(v) {
        pendingUndo = v;
      }, get undoTimer() {
        return undoTimer;
      }, set undoTimer(v) {
        undoTimer = v;
      }, filterItems, grouped, isEmptyAll, isEmptyFiltered, emptyFilteredTitle, refresh, onQuickAdd, onToggle, onRemove, onUndo, onEdit, onFab, onSettings, onToggleGroup, onFilterChange, ref: vue.ref, computed: vue.computed, watch: vue.watch, get onShow() {
        return onShow;
      }, get onUnload() {
        return onUnload;
      }, TopBar, QuickAdd, CategoryFilter, TaskList, EmptyState, FabButton, get useTheme() {
        return useTheme;
      }, get listCategories() {
        return listCategories;
      }, get createTask() {
        return createTask;
      }, get queryTasks() {
        return queryTasks;
      }, get toggleDone() {
        return toggleDone;
      }, get removeTask() {
        return removeTask;
      }, get restoreTask() {
        return restoreTask;
      }, get groupTasks() {
        return groupTasks;
      }, get getSettings() {
        return getSettings;
      }, get updateSettings() {
        return updateSettings;
      }, get scheduleTask() {
        return scheduleTask;
      }, get cancelTask() {
        return cancelTask;
      }, get removeImages() {
        return removeImages;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["page", $setup.themeCls])
      },
      [
        vue.createVNode($setup["TopBar"], {
          modelValue: $setup.keyword,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.keyword = $event),
          "pending-count": $setup.remainingCount,
          onSettings: $setup.onSettings
        }, null, 8, ["modelValue", "pending-count"]),
        vue.createVNode($setup["QuickAdd"], {
          modelValue: $setup.draft,
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.draft = $event),
          onSubmit: $setup.onQuickAdd
        }, null, 8, ["modelValue"]),
        vue.createVNode($setup["CategoryFilter"], {
          items: $setup.filterItems,
          current: $setup.filterId,
          onChange: $setup.onFilterChange
        }, null, 8, ["items", "current"]),
        vue.createElementVNode("view", { class: "content" }, [
          $setup.isEmptyAll ? (vue.openBlock(), vue.createBlock($setup["EmptyState"], {
            key: 0,
            art: "🌱",
            title: "没有别的了",
            hint: "点右下角的 ＋ 记一件吧 ✨"
          })) : $setup.isEmptyFiltered ? (vue.openBlock(), vue.createBlock($setup["EmptyState"], {
            key: 1,
            art: $setup.keyword ? "🔍" : "🤔",
            title: $setup.emptyFilteredTitle,
            hint: ""
          }, null, 8, ["art", "title"])) : (vue.openBlock(), vue.createBlock($setup["TaskList"], {
            key: 2,
            active: $setup.grouped.active,
            completed: $setup.grouped.completed,
            collapsed: $setup.collapsed,
            categories: $setup.categories,
            onToggle: $setup.onToggle,
            onEdit: $setup.onEdit,
            onRemove: $setup.onRemove,
            onToggleGroup: $setup.onToggleGroup
          }, null, 8, ["active", "completed", "collapsed", "categories"]))
        ]),
        $setup.undoVisible ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "undo-bar"
        }, [
          vue.createElementVNode("text", { class: "undo-text" }, "已删除"),
          vue.createElementVNode("text", {
            class: "undo-btn",
            onClick: $setup.onUndo
          }, "撤销")
        ])) : vue.createCommentVNode("v-if", true),
        vue.createVNode($setup["FabButton"], { onClick: $setup.onFab })
      ],
      2
      /* CLASS */
    );
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-1cf27b2a"], ["__file", "D:/软件开发/whatelse-todo/pages/index/index.vue"]]);
  const _sfc_main$9 = {
    __name: "NavBar",
    props: {
      title: { type: String, default: "" },
      saveText: { type: String, default: "保存" },
      showSave: { type: Boolean, default: true }
    },
    emits: ["back", "save"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      let statusBarHeight = 0;
      try {
        const info = uni.getSystemInfoSync();
        statusBarHeight = info.statusBarHeight || 0;
      } catch (e) {
        statusBarHeight = 0;
      }
      const topStyle = "padding-top:" + statusBarHeight + "px";
      function onBack() {
        emit("back");
      }
      function onSave() {
        if (props.showSave)
          emit("save");
      }
      const __returned__ = { props, emit, get statusBarHeight() {
        return statusBarHeight;
      }, set statusBarHeight(v) {
        statusBarHeight = v;
      }, topStyle, onBack, onSave };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "nav",
      style: $setup.topStyle
    }, [
      vue.createElementVNode("view", { class: "row" }, [
        vue.createElementVNode("view", {
          class: "side",
          onClick: $setup.onBack
        }, [
          vue.createElementVNode("view", { class: "back-arrow" })
        ]),
        vue.createElementVNode(
          "text",
          { class: "title" },
          vue.toDisplayString($props.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", {
          class: "side right",
          onClick: $setup.onSave
        }, [
          $props.showSave ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              class: "save"
            },
            vue.toDisplayString($props.saveText),
            1
            /* TEXT */
          )) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const NavBar = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-2202255b"], ["__file", "D:/软件开发/whatelse-todo/components/NavBar.vue"]]);
  const _sfc_main$8 = {
    __name: "FieldText",
    props: {
      modelValue: { type: String, default: "" },
      label: { type: String, default: "" },
      placeholder: { type: String, default: "" },
      maxlength: { type: Number, default: 200 },
      autoFocus: { type: Boolean, default: false }
    },
    emits: ["update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function onInput(e) {
        emit("update:modelValue", e.detail.value);
      }
      const __returned__ = { props, emit, onInput };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "field" }, [
      $props.label ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 0,
          class: "label"
        },
        vue.toDisplayString($props.label),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("textarea", {
        class: "textarea",
        value: $props.modelValue,
        placeholder: $props.placeholder,
        "placeholder-class": "ph",
        maxlength: $props.maxlength,
        "auto-height": "",
        focus: $props.autoFocus,
        "show-confirm-bar": false,
        onInput: $setup.onInput
      }, null, 40, ["value", "placeholder", "maxlength", "focus"])
    ]);
  }
  const FieldText = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-2638c8df"], ["__file", "D:/软件开发/whatelse-todo/components/FieldText.vue"]]);
  const _sfc_main$7 = {
    __name: "CategoryPicker",
    props: {
      categories: { type: Array, default: function() {
        return [];
      } },
      current: { type: String, default: "default" }
    },
    emits: ["change"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function onPick(id) {
        if (id === props.current)
          return;
        emit("change", id);
      }
      const __returned__ = { props, emit, onPick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "picker" }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($props.categories, (c) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: c.id,
            class: vue.normalizeClass(["pill", { on: c.id === $props.current }]),
            onClick: ($event) => $setup.onPick(c.id)
          }, [
            vue.createElementVNode(
              "view",
              {
                class: "dot",
                style: vue.normalizeStyle({ backgroundColor: c.color })
              },
              null,
              4
              /* STYLE */
            ),
            vue.createElementVNode(
              "text",
              { class: "name" },
              vue.toDisplayString(c.name),
              1
              /* TEXT */
            )
          ], 10, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const CategoryPicker = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-1807ed57"], ["__file", "D:/软件开发/whatelse-todo/components/CategoryPicker.vue"]]);
  const YEAR_SPAN = 5;
  const _sfc_main$6 = {
    __name: "DateTimeRow",
    props: {
      label: { type: String, default: "" },
      modelValue: { type: Number, default: null },
      placeholder: { type: String, default: "未设置" }
    },
    emits: ["update:modelValue"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const BASE_YEAR = (/* @__PURE__ */ new Date()).getFullYear();
      function pad22(n) {
        return n < 10 ? "0" + n : "" + n;
      }
      const YEARS = [];
      for (let i = 0; i < YEAR_SPAN; i++)
        YEARS.push(String(BASE_YEAR + i));
      const MONTHS = [];
      for (let i = 1; i <= 12; i++)
        MONTHS.push(pad22(i));
      const HOURS = [];
      for (let i = 0; i < 24; i++)
        HOURS.push(pad22(i));
      const MINUTES = [];
      for (let i = 0; i < 60; i++)
        MINUTES.push(pad22(i));
      function daysOf(year, month) {
        return new Date(year, month, 0).getDate();
      }
      function buildDays(year, month) {
        const n = daysOf(year, month);
        const arr = [];
        for (let i = 1; i <= n; i++)
          arr.push(pad22(i));
        return arr;
      }
      const days = vue.ref(buildDays(BASE_YEAR, 1));
      const pickerIndex = vue.ref([0, 0, 0, 9, 0]);
      const range = vue.computed(function() {
        return [YEARS, MONTHS, days.value, HOURS, MINUTES];
      });
      const hasValue = vue.computed(function() {
        return !!props.modelValue;
      });
      const displayText = vue.computed(function() {
        return props.modelValue ? formatRemind(props.modelValue) : props.placeholder;
      });
      function nextHour() {
        const d = /* @__PURE__ */ new Date();
        d.setMinutes(0, 0, 0);
        d.setHours(d.getHours() + 1);
        return d;
      }
      function syncFromValue() {
        const ts = props.modelValue;
        const d = ts ? new Date(ts) : nextHour();
        let yi = YEARS.indexOf(String(d.getFullYear()));
        if (yi < 0)
          yi = 0;
        days.value = buildDays(BASE_YEAR + yi, d.getMonth() + 1);
        const di = Math.min(d.getDate() - 1, days.value.length - 1);
        pickerIndex.value = [yi, d.getMonth(), di, d.getHours(), d.getMinutes()];
      }
      vue.watch(function() {
        return props.modelValue;
      }, syncFromValue, { immediate: true });
      function onColumnChange(e) {
        const col = e.detail.column;
        const val = e.detail.value;
        const idx = pickerIndex.value.slice();
        idx[col] = val;
        if (col === 0 || col === 1) {
          const year = BASE_YEAR + idx[0];
          const month = idx[1] + 1;
          days.value = buildDays(year, month);
          if (idx[2] > days.value.length - 1)
            idx[2] = days.value.length - 1;
        }
        pickerIndex.value = idx;
      }
      function onChange(e) {
        const v = e.detail.value;
        const year = BASE_YEAR + v[0];
        const month = v[1] + 1;
        const day = v[2] + 1;
        const ts = new Date(year, month - 1, day, v[3], v[4], 0, 0).getTime();
        emit("update:modelValue", ts);
      }
      function onClear() {
        emit("update:modelValue", null);
      }
      const __returned__ = { props, emit, BASE_YEAR, YEAR_SPAN, pad2: pad22, YEARS, MONTHS, HOURS, MINUTES, daysOf, buildDays, days, pickerIndex, range, hasValue, displayText, nextHour, syncFromValue, onColumnChange, onChange, onClear, ref: vue.ref, computed: vue.computed, watch: vue.watch, get formatRemind() {
        return formatRemind;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "dt-row" }, [
      vue.createElementVNode(
        "text",
        { class: "label" },
        vue.toDisplayString($props.label),
        1
        /* TEXT */
      ),
      vue.createElementVNode("view", { class: "right" }, [
        vue.createElementVNode("picker", {
          mode: "multiSelector",
          range: $setup.range,
          value: $setup.pickerIndex,
          onChange: $setup.onChange,
          onColumnchange: $setup.onColumnChange
        }, [
          vue.createElementVNode("view", { class: "value-wrap" }, [
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["value", { ph: !$setup.hasValue }])
              },
              vue.toDisplayString($setup.displayText),
              3
              /* TEXT, CLASS */
            ),
            vue.createElementVNode("view", { class: "chev" })
          ])
        ], 40, ["range", "value"]),
        $setup.hasValue ? (vue.openBlock(), vue.createElementBlock("text", {
          key: 0,
          class: "clear",
          onClick: vue.withModifiers($setup.onClear, ["stop"])
        }, "✕")) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const DateTimeRow = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-07c000b9"], ["__file", "D:/软件开发/whatelse-todo/components/DateTimeRow.vue"]]);
  const _sfc_main$5 = {
    __name: "ImagePicker",
    props: {
      images: { type: Array, default: function() {
        return [];
      } },
      max: { type: Number, default: 9 }
    },
    emits: ["add", "remove"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      const tipText = vue.computed(function() {
        if (!props.images.length)
          return "可以配张图，也可以不配";
        return props.images.length + " / " + props.max + " 张";
      });
      function onPreview(index) {
        previewImages(props.images, props.images[index]);
      }
      function onRemove(index) {
        emit("remove", index);
      }
      function onAdd() {
        if (props.images.length >= props.max) {
          uni.showToast({ title: "最多 " + props.max + " 张", icon: "none" });
          return;
        }
        emit("add");
      }
      const __returned__ = { props, emit, tipText, onPreview, onRemove, onAdd, computed: vue.computed, get previewImages() {
        return previewImages;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "picker" }, [
      vue.createElementVNode("view", { class: "grid" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($props.images, (p, i) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: p,
              class: "cell"
            }, [
              vue.createElementVNode("image", {
                class: "thumb",
                src: p,
                mode: "aspectFill",
                onClick: ($event) => $setup.onPreview(i)
              }, null, 8, ["src", "onClick"]),
              vue.createElementVNode("view", {
                class: "del",
                onClick: vue.withModifiers(($event) => $setup.onRemove(i), ["stop"])
              }, [
                vue.createElementVNode("text", { class: "del-x" }, "✕")
              ], 8, ["onClick"])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $props.images.length < $props.max ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "cell add",
          onClick: $setup.onAdd
        }, [
          vue.createElementVNode("view", { class: "plus-h" }),
          vue.createElementVNode("view", { class: "plus-v" })
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode(
        "text",
        { class: "tip" },
        vue.toDisplayString($setup.tipText),
        1
        /* TEXT */
      )
    ]);
  }
  const ImagePicker = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-8ce556f9"], ["__file", "D:/软件开发/whatelse-todo/components/ImagePicker.vue"]]);
  const _sfc_main$4 = {
    __name: "edit",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeCls: themeCls2, applyTheme: applyTheme2 } = useTheme();
      const taskId = vue.ref("");
      const categories = vue.ref([]);
      const isEdit = vue.computed(function() {
        return !!taskId.value;
      });
      const pageTitle = vue.computed(function() {
        return isEdit.value ? "编辑任务" : "新增任务";
      });
      const maxImages = MAX_IMAGES;
      let originalImages = [];
      const form = vue.reactive({
        title: "",
        note: "",
        images: [],
        categoryId: "default",
        remindAt: null,
        dueAt: null
      });
      let snapshot = "";
      function currentSnapshot() {
        return JSON.stringify({
          t: form.title,
          n: form.note,
          i: form.images,
          c: form.categoryId,
          r: form.remindAt,
          d: form.dueAt
        });
      }
      function isDirty() {
        return currentSnapshot() !== snapshot;
      }
      vue.watch(function() {
        return form.remindAt;
      }, function(v) {
        if (v && v <= Date.now()) {
          uni.showToast({ title: "这个时间已经过去了", icon: "none" });
        }
      });
      onShow(function() {
        applyTheme2();
      });
      onLoad(function(options) {
        categories.value = listCategories();
        taskId.value = options && options.id ? options.id : "";
        if (taskId.value) {
          const t = getTaskById(taskId.value);
          if (!t) {
            snapshot = currentSnapshot();
            uni.showToast({ title: "这条任务已经不在了", icon: "none" });
            setTimeout(function() {
              uni.navigateBack();
            }, 800);
            return;
          }
          form.title = t.title;
          form.note = t.note || "";
          form.images = (t.images || []).slice();
          form.categoryId = t.categoryId || "default";
          form.remindAt = t.remindAt || null;
          form.dueAt = t.dueAt || null;
        }
        originalImages = form.images.slice();
        snapshot = currentSnapshot();
      });
      function save() {
        const title = String(form.title || "").trim();
        if (!title) {
          uni.showToast({ title: "内容不能为空", icon: "none" });
          return false;
        }
        if (form.remindAt && form.remindAt <= Date.now()) {
          uni.showModal({
            title: "提醒时间已经过去了",
            content: "提醒时间（" + formatRemind(form.remindAt) + "）早于现在。\n\n过期的提醒不会响。请把它改到将来，或者点右侧的 ✕ 清空。",
            showCancel: false
          });
          return false;
        }
        if (form.remindAt && form.dueAt && form.remindAt > form.dueAt) {
          uni.showModal({
            title: "时间设置有问题",
            content: "提醒时间（" + formatRemind(form.remindAt) + "）晚于截止时间（" + formatRemind(form.dueAt) + "）。\n\n到期之后才提醒没有意义，请把提醒时间提前，或把截止时间推后。",
            showCancel: false
          });
          return false;
        }
        const payload = {
          title,
          note: form.note,
          images: form.images,
          categoryId: form.categoryId,
          remindAt: form.remindAt,
          dueAt: form.dueAt
        };
        const saved = isEdit.value ? updateTask(taskId.value, payload) : createTask(payload);
        if (!saved) {
          uni.showToast({ title: "保存失败", icon: "none" });
          return false;
        }
        const removed = originalImages.filter(function(p) {
          return form.images.indexOf(p) < 0;
        });
        if (removed.length)
          removeImages(removed);
        originalImages = form.images.slice();
        scheduleTask(saved);
        snapshot = currentSnapshot();
        return true;
      }
      function onSave() {
        if (!save())
          return;
        uni.showToast({ title: "已保存", icon: "none", duration: 900 });
        setTimeout(function() {
          uni.navigateBack();
        }, 350);
      }
      function onBack() {
        if (!isDirty()) {
          uni.navigateBack();
          return;
        }
        askDiscard();
      }
      function askDiscard() {
        uni.showModal({
          title: "放弃修改？",
          content: "这次改动还没有保存，返回就丢掉了。",
          cancelText: "继续编辑",
          confirmText: "放弃",
          confirmColor: "#FF5A5F",
          success: function(res) {
            if (res.confirm)
              uni.navigateBack();
          }
        });
      }
      onBackPress(function() {
        if (!isDirty())
          return false;
        askDiscard();
        return true;
      });
      function onDelete() {
        uni.showModal({
          title: "删除这条任务？",
          content: "删除后无法恢复。",
          confirmText: "删除",
          confirmColor: "#FF5A5F",
          success: function(res) {
            if (!res.confirm)
              return;
            if (form.images.length)
              removeImages(form.images);
            removeTask(taskId.value);
            cancelTask(taskId.value);
            uni.navigateBack();
          }
        });
      }
      function onCategoryChange(id) {
        form.categoryId = id;
      }
      function onAddImages() {
        const remain = maxImages - form.images.length;
        if (remain <= 0) {
          uni.showToast({ title: "最多 " + maxImages + " 张", icon: "none" });
          return;
        }
        addImages(remain).then(function(paths) {
          if (!paths.length)
            return;
          form.images = form.images.concat(paths);
        });
      }
      function onRemoveImage(index) {
        const next = form.images.slice();
        next.splice(index, 1);
        form.images = next;
      }
      const __returned__ = { themeCls: themeCls2, applyTheme: applyTheme2, taskId, categories, isEdit, pageTitle, maxImages, get originalImages() {
        return originalImages;
      }, set originalImages(v) {
        originalImages = v;
      }, form, get snapshot() {
        return snapshot;
      }, set snapshot(v) {
        snapshot = v;
      }, currentSnapshot, isDirty, save, onSave, onBack, askDiscard, onDelete, onCategoryChange, onAddImages, onRemoveImage, ref: vue.ref, reactive: vue.reactive, computed: vue.computed, watch: vue.watch, get onLoad() {
        return onLoad;
      }, get onShow() {
        return onShow;
      }, get onBackPress() {
        return onBackPress;
      }, NavBar, FieldText, CategoryPicker, DateTimeRow, ImagePicker, get useTheme() {
        return useTheme;
      }, get formatRemind() {
        return formatRemind;
      }, get listCategories() {
        return listCategories;
      }, get createTask() {
        return createTask;
      }, get updateTask() {
        return updateTask;
      }, get removeTask() {
        return removeTask;
      }, get getTaskById() {
        return getTaskById;
      }, get scheduleTask() {
        return scheduleTask;
      }, get cancelTask() {
        return cancelTask;
      }, get addImages() {
        return addImages;
      }, get removeImages() {
        return removeImages;
      }, get MAX_IMAGES() {
        return MAX_IMAGES;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["page", $setup.themeCls])
      },
      [
        vue.createVNode($setup["NavBar"], {
          title: $setup.pageTitle,
          onBack: $setup.onBack,
          onSave: $setup.onSave
        }, null, 8, ["title"]),
        vue.createElementVNode("scroll-view", {
          class: "body",
          "scroll-y": ""
        }, [
          vue.createVNode($setup["FieldText"], {
            modelValue: $setup.form.title,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.form.title = $event),
            label: "内容",
            placeholder: "还有什么要做的？",
            maxlength: 200,
            "auto-focus": !$setup.isEdit
          }, null, 8, ["modelValue", "auto-focus"]),
          vue.createVNode($setup["FieldText"], {
            modelValue: $setup.form.note,
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.form.note = $event),
            label: "备注",
            placeholder: "补充说明（可留空）",
            maxlength: 500
          }, null, 8, ["modelValue"]),
          vue.createElementVNode("view", { class: "card" }, [
            vue.createElementVNode("text", { class: "sec-label" }, "分类"),
            vue.createVNode($setup["CategoryPicker"], {
              categories: $setup.categories,
              current: $setup.form.categoryId,
              onChange: $setup.onCategoryChange
            }, null, 8, ["categories", "current"])
          ]),
          vue.createElementVNode("view", { class: "card" }, [
            vue.createElementVNode("text", { class: "sec-label" }, "图片（可选）"),
            vue.createVNode($setup["ImagePicker"], {
              images: $setup.form.images,
              max: $setup.maxImages,
              onAdd: $setup.onAddImages,
              onRemove: $setup.onRemoveImage
            }, null, 8, ["images", "max"])
          ]),
          vue.createElementVNode("view", { class: "card" }, [
            vue.createElementVNode("text", { class: "sec-label" }, "时间"),
            vue.createVNode($setup["DateTimeRow"], {
              modelValue: $setup.form.remindAt,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $setup.form.remindAt = $event),
              label: "提醒时间"
            }, null, 8, ["modelValue"]),
            vue.createVNode($setup["DateTimeRow"], {
              modelValue: $setup.form.dueAt,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $setup.form.dueAt = $event),
              label: "截止时间"
            }, null, 8, ["modelValue"]),
            vue.createElementVNode("text", { class: "hint" }, "提醒时间不能晚于截止时间，也不能早于现在；两个都可以不设。")
          ]),
          $setup.isEdit ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "danger-zone"
          }, [
            vue.createElementVNode("view", {
              class: "danger-btn",
              onClick: $setup.onDelete
            }, "删除这条任务")
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      2
      /* CLASS */
    );
  }
  const PagesTaskEdit = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-cb10ff92"], ["__file", "D:/软件开发/whatelse-todo/pages/task/edit.vue"]]);
  const _sfc_main$3 = {
    __name: "SettingRow",
    props: {
      label: { type: String, default: "" },
      value: { type: String, default: "" },
      showArrow: { type: Boolean, default: true }
    },
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const props = __props;
      const emit = __emit;
      function onClick() {
        emit("click");
      }
      const __returned__ = { props, emit, onClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "setting-row",
      onClick: $setup.onClick
    }, [
      vue.createElementVNode(
        "text",
        { class: "label" },
        vue.toDisplayString($props.label),
        1
        /* TEXT */
      ),
      vue.createElementVNode("view", { class: "right" }, [
        $props.value ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "value"
          },
          vue.toDisplayString($props.value),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true),
        $props.showArrow ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "arrow"
        })) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const SettingRow = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-8f6accb2"], ["__file", "D:/软件开发/whatelse-todo/components/SettingRow.vue"]]);
  const _sfc_main$2 = {
    __name: "PermissionBanner",
    emits: ["click"],
    setup(__props, { expose: __expose, emit: __emit }) {
      __expose();
      const emit = __emit;
      function onClick() {
        emit("click");
      }
      const __returned__ = { emit, onClick };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "banner",
      onClick: $setup.onClick
    }, [
      vue.createElementVNode("view", { class: "warn-dot" }),
      vue.createElementVNode("text", { class: "text" }, "通知权限未开启，点此去开启")
    ]);
  }
  const PermissionBanner = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-cf2fa34e"], ["__file", "D:/软件开发/whatelse-todo/components/PermissionBanner.vue"]]);
  function buildExportPayload() {
    return {
      app: EXPORT_APP_ID,
      schemaVersion: SCHEMA_VERSION,
      exportedAt: Date.now(),
      tasks: loadTasks(),
      categories: loadCategories(),
      settings: loadSettings()
    };
  }
  function exportToText() {
    return JSON.stringify(buildExportPayload(), null, 2);
  }
  function parseImportText(text) {
    const raw = String(text == null ? "" : text).trim();
    if (!raw)
      return { ok: false, reason: "剪贴板里没有内容" };
    let obj;
    try {
      obj = JSON.parse(raw);
    } catch (e) {
      return { ok: false, reason: "剪贴板里的内容不是合法的 JSON 文本" };
    }
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
      return { ok: false, reason: "数据格式不正确" };
    }
    if (obj.app !== EXPORT_APP_ID) {
      return { ok: false, reason: "这不是「还有什么」导出的备份" };
    }
    const ver = parseInt(obj.schemaVersion, 10) || 0;
    if (ver > SCHEMA_VERSION) {
      return { ok: false, reason: "备份来自更新版本的 App，当前版本读不了" };
    }
    if (!Array.isArray(obj.tasks)) {
      return { ok: false, reason: "备份里没有任务数据" };
    }
    if (!Array.isArray(obj.categories) || !obj.categories.length) {
      return { ok: false, reason: "备份里没有分类数据" };
    }
    return { ok: true, data: obj };
  }
  function applyImport(data) {
    const d = data || {};
    replaceAll({
      tasks: d.tasks || [],
      categories: d.categories || [],
      settings: d.settings || {}
    });
    return {
      tasks: (d.tasks || []).length,
      categories: (d.categories || []).length
    };
  }
  function dataSummary() {
    const tasks = loadTasks();
    let completed = 0;
    tasks.forEach(function(t) {
      if (t.done)
        completed++;
    });
    return {
      tasks: tasks.length,
      completed,
      categories: loadCategories().length
    };
  }
  const _sfc_main$1 = {
    __name: "settings",
    setup(__props, { expose: __expose }) {
      __expose();
      const { themeCls: themeCls2, applyTheme: applyTheme2 } = useTheme();
      const categories = vue.ref([]);
      const theme = vue.ref("system");
      const sortBy = vue.ref("created");
      const dismissed = vue.ref(false);
      const catEditorVisible = vue.ref(false);
      const themeText = vue.computed(function() {
        return themeLabel(theme.value);
      });
      const sortText = vue.computed(function() {
        return sortLabel(sortBy.value);
      });
      const showPermBanner = vue.computed(function() {
        return !dismissed.value;
      });
      function reload() {
        const s = getSettings();
        theme.value = s.theme;
        sortBy.value = s.sortBy;
        dismissed.value = s.notifyGuideDismissed === true;
        categories.value = listCategories();
      }
      onShow(function() {
        applyTheme2();
        reload();
      });
      function onBack() {
        uni.navigateBack();
      }
      function onPickTheme() {
        uni.showActionSheet({
          itemList: ["跟随系统", "浅色", "深色"],
          success: function(res) {
            const map = ["system", "light", "dark"];
            updateSettings({ theme: map[res.tapIndex] || "system" });
            applyTheme2();
            reload();
          }
        });
      }
      function onPickSort() {
        uni.showActionSheet({
          itemList: ["按创建时间", "按提醒时间"],
          success: function(res) {
            updateSettings({ sortBy: res.tapIndex === 1 ? "remind" : "created" });
            reload();
          }
        });
      }
      function onOpenPermission() {
        let jumped = false;
        try {
          const main = plus.android.runtimeMainActivity();
          const Intent = plus.android.importClass("android.content.Intent");
          const SettingsCls = plus.android.importClass("android.provider.Settings");
          const intent = new Intent(SettingsCls.ACTION_APP_NOTIFICATION_SETTINGS);
          intent.putExtra(SettingsCls.EXTRA_APP_PACKAGE, main.getPackageName());
          main.startActivity(intent);
          jumped = true;
        } catch (e) {
          jumped = false;
        }
        if (!jumped) {
          uni.showModal({
            title: "请手动开启通知权限",
            content: "设置 → 通知管理 → 找到「还有什么」→ 打开「允许通知」",
            showCancel: false
          });
        }
        updateSettings({ notifyGuideDismissed: true });
        reload();
      }
      function openCatEditor() {
        categories.value = listCategories();
        catEditorVisible.value = true;
      }
      function closeCatEditor() {
        catEditorVisible.value = false;
        reload();
      }
      function onAddCat() {
        uni.showModal({
          title: "新增分类",
          editable: true,
          placeholderText: "分类名（最多 8 个字）",
          success: function(res) {
            if (!res.confirm)
              return;
            const created = createCategory({ name: res.content, color: CATEGORY_COLORS[0] });
            if (!created) {
              uni.showToast({ title: "名称不能为空或已存在", icon: "none" });
              return;
            }
            categories.value = listCategories();
          }
        });
      }
      function onRename(c) {
        uni.showModal({
          title: "重命名分类",
          editable: true,
          placeholderText: c.name,
          success: function(res) {
            if (!res.confirm)
              return;
            const updated = updateCategory(c.id, { name: res.content });
            if (!updated) {
              uni.showToast({ title: "名称不能为空或已存在", icon: "none" });
              return;
            }
            categories.value = listCategories();
          }
        });
      }
      function onCycleColor(c) {
        const idx = CATEGORY_COLORS.indexOf(c.color);
        const next = CATEGORY_COLORS[(idx + 1) % CATEGORY_COLORS.length];
        updateCategory(c.id, { color: next });
        categories.value = listCategories();
      }
      function onDeleteCat(c) {
        const n = countTasksIn(c.id);
        uni.showModal({
          title: "删除分类「" + c.name + "」？",
          content: n > 0 ? "该分类下的 " + n + " 条任务会移到「默认」分类，任务本身不会丢。" : "该分类下没有任务。",
          confirmText: "删除",
          confirmColor: "#FF3B30",
          success: function(res) {
            if (!res.confirm)
              return;
            const moved = removeCategory(c.id);
            if (moved < 0) {
              uni.showToast({ title: "这个分类不能删", icon: "none" });
              return;
            }
            categories.value = listCategories();
            uni.showToast({
              title: moved > 0 ? "已删除，" + moved + " 条任务移到默认" : "已删除",
              icon: "none"
            });
          }
        });
      }
      function onExport() {
        const text = exportToText();
        const sum = dataSummary();
        uni.setClipboardData({
          data: text,
          success: function() {
            uni.showModal({
              title: "已复制到剪贴板",
              content: "共 " + sum.tasks + " 条任务（已完成 " + sum.completed + " 条）、" + sum.categories + " 个分类。\n\n请粘贴到微信收藏、备忘录或电脑上保存。",
              showCancel: false
            });
          },
          fail: function() {
            uni.showModal({
              title: "复制失败",
              content: "系统不允许访问剪贴板，请检查应用权限。",
              showCancel: false
            });
          }
        });
      }
      function onImport() {
        uni.getClipboardData({
          success: function(res) {
            const parsed = parseImportText(res.data);
            if (!parsed.ok) {
              uni.showModal({
                title: "导入失败",
                content: parsed.reason,
                showCancel: false
              });
              return;
            }
            const incoming = parsed.data;
            uni.showModal({
              title: "确认导入？",
              content: "备份里有 " + incoming.tasks.length + " 条任务、" + incoming.categories.length + " 个分类。\n\n导入会用它们覆盖当前全部数据，且无法撤销。建议先导出一次当前数据。",
              confirmText: "覆盖导入",
              confirmColor: "#FF3B30",
              success: function(r) {
                if (!r.confirm)
                  return;
                const applied = applyImport(incoming);
                uni.showToast({
                  title: "已导入 " + applied.tasks + " 条任务",
                  icon: "none",
                  duration: 2e3
                });
                reload();
              }
            });
          },
          fail: function() {
            uni.showModal({
              title: "读取剪贴板失败",
              content: "请先把备份内容复制到剪贴板，再回到这里点「导入数据」。",
              showCancel: false
            });
          }
        });
      }
      const __returned__ = { themeCls: themeCls2, applyTheme: applyTheme2, categories, theme, sortBy, dismissed, catEditorVisible, themeText, sortText, showPermBanner, reload, onBack, onPickTheme, onPickSort, onOpenPermission, openCatEditor, closeCatEditor, onAddCat, onRename, onCycleColor, onDeleteCat, onExport, onImport, ref: vue.ref, computed: vue.computed, get onShow() {
        return onShow;
      }, NavBar, SettingRow, PermissionBanner, get useTheme() {
        return useTheme;
      }, get getSettings() {
        return getSettings;
      }, get updateSettings() {
        return updateSettings;
      }, get themeLabel() {
        return themeLabel;
      }, get sortLabel() {
        return sortLabel;
      }, get listCategories() {
        return listCategories;
      }, get createCategory() {
        return createCategory;
      }, get updateCategory() {
        return updateCategory;
      }, get removeCategory() {
        return removeCategory;
      }, get countTasksIn() {
        return countTasksIn;
      }, get exportToText() {
        return exportToText;
      }, get parseImportText() {
        return parseImportText;
      }, get applyImport() {
        return applyImport;
      }, get dataSummary() {
        return dataSummary;
      }, get CATEGORY_COLORS() {
        return CATEGORY_COLORS;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["page", $setup.themeCls])
      },
      [
        vue.createVNode($setup["NavBar"], {
          title: "设置",
          "show-save": false,
          onBack: $setup.onBack
        }),
        $setup.showPermBanner ? (vue.openBlock(), vue.createBlock($setup["PermissionBanner"], {
          key: 0,
          onClick: $setup.onOpenPermission
        })) : vue.createCommentVNode("v-if", true),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "sec-title" }, "🎨 外观"),
          vue.createVNode($setup["SettingRow"], {
            label: "主题",
            value: $setup.themeText,
            onClick: $setup.onPickTheme
          }, null, 8, ["value"])
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "sec-title" }, "📋 列表"),
          vue.createVNode($setup["SettingRow"], {
            label: "排序方式",
            value: $setup.sortText,
            onClick: $setup.onPickSort
          }, null, 8, ["value"])
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "sec-title" }, "🏷️ 分类"),
          vue.createVNode($setup["SettingRow"], {
            label: "分类管理",
            value: $setup.categories.length + " 个",
            onClick: $setup.openCatEditor
          }, null, 8, ["value"])
        ]),
        vue.createElementVNode("view", { class: "section" }, [
          vue.createElementVNode("text", { class: "sec-title" }, "💾 数据"),
          vue.createVNode($setup["SettingRow"], {
            label: "导出数据",
            value: "复制到剪贴板",
            onClick: $setup.onExport
          }),
          vue.createVNode($setup["SettingRow"], {
            label: "导入数据",
            value: "从剪贴板恢复",
            onClick: $setup.onImport
          })
        ]),
        vue.createElementVNode("view", { class: "about" }, [
          vue.createElementVNode("text", { class: "about-name" }, "还有什么"),
          vue.createElementVNode("text", { class: "about-ver" }, "v1.0.0"),
          vue.createElementVNode("text", { class: "about-desc" }, "一个只问你「还有什么要做」的本地待办清单"),
          vue.createElementVNode("text", { class: "about-note" }, "所有数据仅保存在本机，不会上传到任何地方")
        ]),
        $setup.catEditorVisible ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "mask",
          onClick: $setup.closeCatEditor
        }, [
          vue.createElementVNode("view", {
            class: "sheet",
            onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("view", { class: "sheet-head" }, [
              vue.createElementVNode("text", { class: "sheet-title" }, "分类管理"),
              vue.createElementVNode("text", {
                class: "sheet-done",
                onClick: $setup.closeCatEditor
              }, "完成")
            ]),
            vue.createElementVNode("scroll-view", {
              class: "sheet-body",
              "scroll-y": ""
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.categories, (c) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: c.id,
                    class: "cat-row"
                  }, [
                    vue.createElementVNode("view", {
                      class: "cat-dot",
                      style: vue.normalizeStyle({ backgroundColor: c.color }),
                      onClick: ($event) => $setup.onCycleColor(c)
                    }, null, 12, ["onClick"]),
                    vue.createElementVNode("text", {
                      class: "cat-name",
                      onClick: ($event) => $setup.onRename(c)
                    }, vue.toDisplayString(c.name), 9, ["onClick"]),
                    c.id !== "default" ? (vue.openBlock(), vue.createElementBlock("text", {
                      key: 0,
                      class: "cat-del",
                      onClick: ($event) => $setup.onDeleteCat(c)
                    }, "删除", 8, ["onClick"])) : (vue.openBlock(), vue.createElementBlock("text", {
                      key: 1,
                      class: "cat-lock"
                    }, "不可删"))
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createElementVNode("view", {
                class: "cat-add",
                onClick: $setup.onAddCat
              }, "+ 新增分类"),
              vue.createElementVNode("view", { class: "sheet-tip" }, "点圆点换颜色，点名字改名。")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2
      /* CLASS */
    );
  }
  const PagesSettingsSettings = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-7fad0a1c"], ["__file", "D:/软件开发/whatelse-todo/pages/settings/settings.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/task/edit", PagesTaskEdit);
  __definePage("pages/settings/settings", PagesSettingsSettings);
  const _sfc_main = {
    __name: "App",
    setup(__props, { expose: __expose }) {
      __expose();
      function pickTaskId(data) {
        if (!data)
          return "";
        let payload = data.payload;
        if (typeof payload === "string") {
          try {
            payload = JSON.parse(payload);
          } catch (e) {
            payload = null;
          }
        }
        return payload && payload.taskId ? payload.taskId : "";
      }
      onLaunch(function() {
        initStorage();
        migrateIfNeeded();
        ensureChannel();
        refreshAll();
        if (typeof uni.onPushMessage === "function") {
          uni.onPushMessage(function(res) {
            if (!res || res.type !== "click")
              return;
            const taskId = pickTaskId(res.data);
            if (!taskId)
              return;
            setTimeout(function() {
              uni.navigateTo({ url: "/pages/task/edit?id=" + taskId });
            }, 300);
          });
        }
      });
      onShow(function() {
        refreshAll();
      });
      const __returned__ = { pickTaskId, get onLaunch() {
        return onLaunch;
      }, get onShow() {
        return onShow;
      }, get initStorage() {
        return initStorage;
      }, get migrateIfNeeded() {
        return migrateIfNeeded;
      }, get ensureChannel() {
        return ensureChannel;
      }, get refreshAll() {
        return refreshAll;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "D:/软件开发/whatelse-todo/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
