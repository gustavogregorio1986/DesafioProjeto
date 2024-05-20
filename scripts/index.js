import { Tab } from "bootstrap";

const excludeFields = {
  text: ["change_image", "change_icon", "icon_color"],
};
const icons = [];

class Listar{
      const methods = {
      position_tag: (el) => this.changePositionImage(el),
      texto_da_tag: (el) => this.changeTextTag(el),
      salvar_template: (el) => this.save_template(el),
      background_color: (el) => this.changeColor(el),
      text_color: (el) => this.changeColor(el),
      icon_color: (el) => this.changeColor(el, true, "i"),
      border_type: (el) => this.changeBorder(el),
      border_width: (el) => this.changeBorderWidth(el),
      border_color: (el) => this.changeBorderColor(el),
      rounded: (el) => this.changeRadius(el),
      width: (el) => this.changeWidth(el),
      align_horizontal: (el, ref) => this.changeAlign(el, ref),
      align_vertical: (el, ref) => this.changeAlign(el, ref),
      type: (el) => this.changeType(el),
      change_image: (el) => this.changeImage(el),
      change_title: (el) => this.changeTitle(el),
      icon: (el) => this.changeIcon(el),
      exclude_image: (el) => this.excludeImage(el),
      action: (el) => this.changeAction(el),
      action_link: (el) => this.changeValue(el, "action_url"),
      action_phone: (el) => this.changeActionPhone(el),
      action_phone_message: (el) => this.changeActionPhoneMessage(el),
      only: (el) => this.changeValue(el, "only"),
      stock: (el) => this.changeValue(el, "stock"),
      fontSize: (el) => this.changeFontSize(el),
    };

    Object.entries(this.refs).forEach(([ref, element]) =>
      methods?.[ref]?.(element, ref)
    );
  }

}

class ImagemBorder{
      changeFields(type) {
    const findAllFields = document.querySelectorAll("[data-field]");
    if (!findAllFields) return;

    const elements = {
      image: this.findEl("tag_image"),
      text: this.findEl("tag"),
      icon: this.findEl("tag"),
      text_icon: this.findEl("tag"),
    };

    // All Fields
    findAllFields.forEach((el) => {
      const { field } = el?.dataset;
      if (!excludeFields?.[type]) return;
      el.classList.remove("hidden");
      excludeFields[type].forEach((exclude) => {
        if (field != exclude) return;
        el.classList.add("hidden");
      });
    });

    // Select Element Type
    Object.values(elements).forEach((el) => el.classList.add("hidden"));

    const currentElement = elements?.[type] || {};

    currentElement?.classList.remove("hidden");

    // Draw Start Icon
    const icon = currentElement?.querySelector("i");
    const text = currentElement?.querySelector("div");
    if (["text_icon", "icon"].includes(type)) {
      this.drawIcon(currentElement, icon);
    } else icon && icon.remove();

    if (type === "icon") text?.remove();
    else this.changeTextTag(currentElement, false);

    // Save Type
    this.localOpt("config", "type", type);
  }

  drawIcon(el, icon) {
    if (icon) return;

    const defaultIcon = this.localOpt("config", "icon", null, true);
    const currentIcon = icons.find((i) => i.icon === defaultIcon);
    if (!currentIcon) return;

    const elIcon = document.createElement("i");
    currentIcon?.icon?.split(" ")?.forEach((i) => elIcon.classList.add(i));
    el.insertAdjacentElement("afterBegin", elIcon);
  }

  formatAlignOptions(type = "all") {
    const horizontal = this.findEl("align_horizontal");
    const vertical = this.findEl("align_vertical");

    [(horizontal, vertical)].forEach((align) => {
      if (type != align && type != "all") {
        return align.classList.add("d-none");
      }
      align.classList.remove("d-none");
    });
  }

  changeAlign(el, ref) {
    this.formatAlignOptions("all");
    const findButtons = el.querySelectorAll("li");
    if (!findButtons) return;

    const styleRef = {
      align_vertical: "alignItems",
      align_horizontal: "justifyContent",
    };

    const findBtnActive = Object.values(findButtons).find((btn) =>
      btn.classList.contains("active")
    );

    const setAlign = (button) => {
      const { event } = button?.dataset || {};
      const tag = this.findEl("tag_container");

      Object.values(findButtons).forEach((btn) =>
        btn.classList.remove("active")
      );
      button.classList.add("active");

      tag.style[styleRef[ref]] = event;
      this.localOpt("container", styleRef[ref], event);
    };

    if (findBtnActive) {
      const evt = findBtnActive?.dataset?.event;
      const align = this.localOpt("container", styleRef[ref], evt, true);
      const findButtonAlign = Object.values(findButtons).find(
        (btn) => btn?.dataset?.event === align
      );
      setAlign(findButtonAlign);
    }

    Object.values(findButtons).forEach((button) =>
      this.listener("click", button, () => setAlign(button))
    );
  }

  localOpt(element, type, value = null, first = false) {
    const valueType = typeof value;

    const formatTypes = {
      container: () => {
        if (first && this.opts?.["custom"]?.[element]?.hasOwnProperty(type)) {
          return this.opts["custom"][element][type];
        }

        if (valueType != "object") {
          return (this.opts["custom"][element][type] = value);
        }
        const opt = this.opts["custom"]?.[element]?.[type] || {};
        this.opts["custom"][element][type] = Object.assign(opt, {
          ...value,
        });
      },
      tag: () => {
        if (first && this.opts?.["custom"]?.[element]?.hasOwnProperty(type)) {
          return this.opts["custom"][element][type];
        }

        if (valueType != "object") {
          return (this.opts["custom"][element][type] = value);
        }
        const opt = this.opts["custom"]?.[element]?.[type] || {};
        this.opts["custom"][element][type] = Object.assign(opt, {
          ...value,
        });
      },
      config: () => {
        if (first && this.opts?.["config"]?.hasOwnProperty(type)) {
          return this.opts["config"][type] || "";
        }

        if (valueType != "object") {
          return (this.opts["config"][type] = value);
        }
        const opt = this.opts["config"]?.[type] || {};
        this.opts["config"][type] = Object.assign(opt, {
          ...value,
        });
      },
    };

    return formatTypes?.[element]?.();
  }

  changeWidth(el) {
    const width = this.localOpt("tag", "width", el.value, true);

    const setWidth = (e, first = false) => {
      const value = e?.target?.value || e;
      const tag = this.findEl("tag");

      tag.style.width = value;
      this.opts["custom"]["width"] = value;
      if (first) el.value = value;
      this.localOpt("tag", "width", value);
    };

    this.listener("input", el, (e) => setWidth(e));
    setWidth(width, true);
  }

  changeRadius(el) {
    const radius = this.localOpt("tag", "borderRadius", el?.value, true);

    const setRadius = (e, first = false) => {
      const value = e?.target?.value || e;
      const tag = this.findEl("tag");

      tag.style.borderRadius = value;
      if (first) el.value = value;
      this.localOpt("tag", "borderRadius", value);
    };

    this.listener("input", el, (e) => setRadius(e));
    setRadius(radius, true);
  }

  changeFontSize(el) {
    const size = this.localOpt("tag", "fontSize", el?.value || 11, true);
    const small = el.querySelector("small");
    const input = el.querySelector("input");

    const setFontSize = (e, first = false) => {
      const value = e?.target?.value || e;
      const tag = this.findEl("tag");

      tag.style.fontSize = `${value}px`;
      small.innerText = value;
      input.value = value;
      if (first) el.value = value;
      this.localOpt("tag", "fontSize", value);
    };

    this.listener("input", el, (e) => setFontSize(e));
    setFontSize(size, true);
  }

  changeBorder(el) {
    let { type } = el?.dataset || {};
    const border = this.localOpt("tag", type, null, true) || "none";
    el.value = border;

    const setBorder = (e) => {
      const borderType = e?.target?.value || e;
      const borderColor = this.findEl("border_color");
      const borderWidth = this.findEl("border_width");

      const tag = this.findEl("tag");
      type = el?.dataset?.type || "";

      tag.style[type] = borderType;
      this.localOpt("tag", type, borderType);

      this.changeBorderColor(borderColor, false);
      this.changeBorderWidth(borderWidth, false);
    };

    this.listener("input", el, (e) => setBorder(e));
    setBorder(border);
  }

  changeColor(el, event = true, selector = null) {
    let { type } = el?.dataset || {};
    const color = this.localOpt("tag", type, null, true);
    const input = el.querySelector("input");
    const iconColor = el?.querySelector(".clr-field");

    const setColor = (e) => {
      const value = e?.target?.value || e;
      let tag = this.findEl("tag");
      if (selector) tag = tag.querySelector(selector);
      type = el?.dataset?.type || "";

      input.value = value;
      iconColor.style.color = value;

      this.localOpt("tag", type, value);
      if (type === "fill") type = "color";
      if (tag) tag.style[type] = value;
    };

    if (event) this.listener("input", input, (e) => setColor(e));
    setColor(color);
  }

  changeBorderColor(el, event = true) {
    let { type } = el?.dataset || {};
    const color = this.localOpt("tag", type, null, true) || "#000000";
    const input = el.querySelector("input");
    const iconColor = el?.querySelector(".clr-field");

    const setColor = (e) => {
      const borderType =
        this.localOpt("tag", "borderStyle", null, true) || "none";

      if (borderType === "none") el.style.display = "none";
      else el.style.display = "flex";

      const borderColor = e?.target?.value || e;
      const tag = this.findEl("tag");
      type = el?.dataset?.type || "";

      input.value = borderColor;
      iconColor.style.color = borderColor;

      tag.style[type] = borderColor;
      this.localOpt("tag", type, borderColor);
    };

    if (event) this.listener("input", input, (e) => setColor(e));
    setColor(color);
  }

  changeBorderWidth(el, event = true) {
    let { type } = el?.dataset || {};
    const border = this.localOpt("tag", type, null, true) || "1";
    const input = el.querySelector("input");
    const small = el.querySelector("small");

    const setBorderWidth = (e) => {
      const borderType =
        this.localOpt("tag", "borderStyle", null, true) || "none";

      if (borderType === "none") el.style.display = "none";
      else el.style.display = "flex";

      type = el?.dataset?.type || "";
      const tag = this.findEl("tag");
      const borderWidth = e?.target?.value || e;

      small.innerText = `${borderWidth}px`;
      input.value = borderWidth;
      tag.style[type] = `${borderWidth}px`;
      this.localOpt("tag", type, borderWidth);
    };

    if (event) this.listener("input", input, (e) => setBorderWidth(e));
    setBorderWidth(border);
  }

  changeTextTag(el, event = true) {
    const text = this.localOpt("config", "text", el.innerText, true);
    const tag = this.findEl("tag");

    const setText = (e, first = false) => {
      const value = e?.target?.innerText || e;
      let tagText = tag.querySelector("div");

      if (!tagText) {
        tagText = document.createElement("div");
        tag.insertAdjacentElement("beforeEnd", tagText);
      }

      if (!value?.length) {
        return (tagText.innerText = "Ex: Frete Grátis");
      }

      tagText.innerText = value;
      if (first) this.refs["texto_da_tag"].innerText = value;
      this.localOpt("config", "text", value);
    };

    if (event) this.listener("input", el, (e) => setText(e));
    setText(text, true);
  }

  changePositionImage(el) {
    const listPositions = {
      insideImage: (prod) => {
        const container =
          prod.querySelector(`[data-store="product-item-image"]`) || null;
        return {
          container,
          position: "absolute",
          newPosition: "beforeend",
          type: "all",
        };
      },
      beforeImage: (prod) => {
        const el = prod.querySelector(`[data-store="product-item-image"]`);
        if (!el) return null;
        const container = el;
        if (!container) return;
        return {
          container,
          position: "static",
          newPosition: "beforebegin",
          type: "horizontal",
        };
      },
      beforeTitle: (prod) => {
        const container = prod.querySelector(
          `[data-store="product-item-info"]`
        );
        if (!container) return null;
        return {
          container,
          position: "static",
          newPosition: "beforebegin",
          type: "horizontal",
        };
      },
      afterPrice: (prod) => {
        const container = prod.querySelector(
          `[data-store="product-item-info"]`
        );
        if (!container) return null;
        return {
          container,
          position: "static",
          newPosition: "beforeend",
          type: "horizontal",
        };
      },
      afterBuy: (prod) => {
        const container = prod.querySelector(`.pay`);
        if (!container) return null;
        return {
          container,
          position: "static",
          newPosition: "afterend",
          type: "horizontal",
        };
      },
    };

}

class Gravar{
     save_template(el) {
    this.listener("click", el, async () => {
      const payload = {
        opts: this.opts,
      };

      const action = this.localOpt("config", "action", null, true);
      if (action === "whatsapp") {
        const phone = this.localOpt("config", "action_phone", null, true);
        if (!phone) {
          return this.toast("Insira um número de telefone na aba 'Ação'", {
            type: "danger",
          });
        }
      }

      this.state.loading = true;
    });
  }

  reset() {
    const findSettingTab = document.querySelector(
      'button[data-bs-toggle="pill"][data-bs-target="#settings"]'
    );
    const settingTab = new Tab(findSettingTab);
    settingTab.show();
  }

}

class ExcluirImagem{
     excludeImage(el) {
    const findSelectedContainer = document.querySelector("#selected_image");
    const changeImageContainer = findSelectedContainer.nextElementSibling;

    this.listener("click", el, () => {
      const image = el.nextElementSibling;
      const tagImage = this.findEl("tag_image");
      tagImage.src = "";
      image.src = "";

      findSelectedContainer.classList.add("hidden");
      changeImageContainer.classList.remove("hidden");
      this.localOpt("config", "image", "");
    });
  }

  changeValue(el, type) {
    const defaultValue = this.localOpt("config", type, null, true);
    const { field } = el.dataset || {};
    if (!field) return;
    const element = el.querySelector(field);

    const change = (value) => {
      this.localOpt("config", type, value);
    };

    this.listener("input", element, ({ target }) => change(target.value));
    if (!defaultValue) return;
    element.value = defaultValue;
    change(defaultValue);
  }
}

class Phone{
    changeActionPhone(el) {
    const defaultValue =
      this.localOpt("config", "action_phone", null, true) || "";
    const input = el.querySelector("input");

    const change = (value) => {
      value = String(value)?.replace(/\D+/g, "");
      this.localOpt("config", "action_phone", value);
    };

    this.listener("input", input, ({ target }) => change(target.value));
    input.value = defaultValue;
    change(defaultValue);
  }

  changeActionPhoneMessage(el) {
    const defaultValue =
      this.localOpt("config", "action_phone_message", null, true) || "";
    const input = el.querySelector("input");

    const change = (value) => {
      this.localOpt("config", "action_phone_message", value);
    };

    this.listener("input", input, ({ target }) => change(target.value));
    input.value = defaultValue;
    change(defaultValue);
  }

}

class InitCustom {
  constructor(refs, type, toast, state, swal) {
    this.refs = refs;
    this.toast = toast;
    this.state = state;
    this.swal = swal;
    this.opts = {};
  }

  findEl = (name) => this.refs?.[name] || null;

  init(change = {}) {
    const { config, custom } = change?.["data"] || {};

    if (change?.["id"]) {
      this.opts["config"] = { ...this.opts["config"], ...config };
      this.opts["custom"] = { ...this.opts["custom"], ...custom };
      this.opts["id"] = change["id"];
      custom?.["tag"] && this.startTagChange(custom["tag"]);
    } else {
      this.opts["config"] = this.opts["config"];
      this.opts["custom"] = this.opts["custom"];
      delete this.opts["id"];
    }

   
  startTagChange(tag) {
    const findTag = this.findEl("tag");
    if (!findTag) return;
    Object.entries(tag).forEach(
      ([field, value]) => (findTag.style[field] = value)
    );
  }

  changeAction(el) {
    const defaultAction = this.localOpt("config", "action", null, true);
    const select = el.querySelector("select");

    const elements = {
      none: [],
      openPage: ["openPage"],
      whatsapp: ["whatsapp"],
    };

    const actions = document.querySelectorAll("[data-action]");

    const change = (value) => {
      actions.forEach((ac) => {
        const { action } = ac.dataset;
        if (elements?.[value]?.includes(action)) {
          ac.classList.remove("d-none");
        } else {
          ac.classList.add("d-none");
        }
      });
      this.localOpt("config", "action", value);
    };

    this.listener("input", select, ({ target }) => change(target.value));

    if (!defaultAction) return;
    select.value = defaultAction;
    change(defaultAction);
  }

  changeIcon(el) {
    const defaultIcon = this.localOpt("config", "icon", null, true);
    const select = el.querySelector("select");
    const tag = this.findEl("tag");

    const change = (value) => {
      const tagIcon = tag?.querySelector("i");
      if (!tagIcon) return;
      tagIcon?.removeAttribute("class");
      const { icon } = icons.find(({ icon }) => icon === value);
      if (!icon) return;
      icon.split(" ").forEach((i) => tagIcon.classList.add(i));
      this.localOpt("config", "icon", value);
    };

    this.listener("input", select, ({ target }) => change(target.value));

    if (!defaultIcon) return;
    select.value = defaultIcon;
    change(defaultIcon);
  }

  changeTitle(el) {
    const defaultTitle = el?.innerText || "Novo Template";
    const title = this.localOpt("config", "title", defaultTitle, true);
    const findPageTitle = document.querySelector("header > h4");
    if (!findPageTitle) return;

    const updateTitle = (e, first = false) => {
      const value = e?.target?.value || e;

      if (!value?.length) value = defaultTitle;
      findPageTitle.innerText = value;
      if (first) this.refs["change_title"].value = value;
      this.localOpt("config", "title", value);
    };

    this.listener("input", el, (e) => updateTitle(e));
    updateTitle(title, true);
  }

  changeImage(el) {
    const input = el.querySelector("input");
    if (!input) return;
    const findImageContainer = el.querySelector("#selected_image");
    const changeImageContainer = input?.parentNode || null;
    const image = this.localOpt("config", "image", "", true);

    const tagImage = this.findEl("tag_image");

    const setImage = (result) => {
      tagImage.src = result;
      this.localOpt("config", "image", result);

      if (findImageContainer) {
        const image = findImageContainer.querySelector("img");
        findImageContainer?.classList?.remove("hidden");
        if (image) image.src = result;
      }
      if (changeImageContainer) {
        changeImageContainer?.classList?.add("hidden");
      }
    };

    if (image) setImage(image);
    this.listener("change", input, (e) => {
      const [file] = e.target.files;
      if (!file) return;
      const fileReader = new FileReader();
      fileReader.onload = ({ target: { result } }) => setImage(result);
      fileReader.readAsDataURL(file);
    });
  }

  changeType(el) {
    const type = this.localOpt("config", "type", null, true);
    this.changeFields(type);
    el.value = type;

    this.listener("input", el, ({ target }) => this.changeFields(target.value));
  }
}

class ListarProjeto{
         const position = this.localOpt("container", "position", el.value, true);

    const setPosition = (e, first = false) => {
      const value = e?.target?.value || e;
      const product = this.findEl("product");
      const tag_container = this.findEl("tag_container");

      const settings = listPositions[value](product);

      const { container, position, newPosition, type } = settings;

      tag_container.style.position = position;
      this.formatAlignOptions(type);
      container.insertAdjacentElement(newPosition, tag_container);
      if (first) el.value = value;
      this.localOpt("container", "position", value);
    };

    this.listener("input", el, (e) => setPosition(e));
    setPosition(position, true);
  }

  listener(event, el, callback) {
    el.addEventListener(event, callback);
  }
}

export { InitCustom };
