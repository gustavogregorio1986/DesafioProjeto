<script setup>
import { inject, reactive, onMounted, getCurrentInstance } from "vue";
import { InitCustom } from "./scripts/index";
import "@melloware/coloris/dist/coloris.css";
import Coloris from "@melloware/coloris";

const toast = inject("moshaToast");
const swal = inject("$swal");

const state = reactive({
  loading: false,
  action: "none",
  only: "all",
  stock: "ever",
  tag: [],
});

const defaultImage = "teste.png";
const logo_app = "logo.png";
window.logo_app = logo_app;

function getDescription(action, type) {
  return type?.find(({ value }) => value === action)?.["description"] || "";
}

onMounted(async () => {
  const { refs } = getCurrentInstance();
  const custom = new InitCustom(refs, toast, state, swal);

  Coloris.init();
  Coloris({
    el: ".coloris",
    theme: "pill",
    themeMode: "dark",
    formatToggle: true,
    closeButton: true,
    closeLabel: "Fechar",
  });

  custom.init(state["tag"]);
});
</script>

<template>
  <div class="container">
    <section class="settings">
      <ul class="nav nav-pills" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            data-bs-toggle="pill"
            data-bs-target="#settings"
          >
            Exibição
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            data-bs-toggle="pill"
            data-bs-target="#custom"
          >
            Customização
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            data-bs-toggle="pill"
            data-bs-target="#actions"
          >
            Ação
          </button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="settings">
          <div class="inputs cScroll">
            <div class="input">
              <label>Titulo</label>
              <input
                ref="change_title"
                type="text"
                placeholder="Ex: Novo Template"
              />
              <small> Identificação da tag internamente no sistema </small>
            </div>
            <hr />
            <div class="input">
              <label>Tipo</label>
              <select ref="type">
                <option value="text" selected>Texto</option>
                <option value="image">Imagem</option>
                <option value="icon">Icone</option>
                <option value="text_icon">Icone e Texto</option>
              </select>
            </div>
            <div class="input" ref="icon" data-field="change_icon">
              <label>Ícone</label>
              <select>
                <option
                  :value="icon"
                  :selected="key === 0"
                  v-for="({ name, icon }, key) in []"
                >
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="input" data-field="change_text">
              <label>Texto da Tag</label>
              <div contenteditable="true" ref="texto_da_tag">Exemplo</div>
            </div>
            <div
              class="input file"
              data-field="change_image"
              ref="change_image"
            >
              <label>Imagem</label>
              <div>
                <span id="selected_image" class="hidden">
                  <div ref="exclude_image">
                    <i class="bx bx-trash"></i>
                  </div>
                  <img :src="logo_app" alt="app" />
                </span>
                <label for="change_image">
                  <input :id="'change_image'" type="file" />
                  <i class="bx bx-images"></i>
                  Selecione uma Imagem
                </label>
                <ul>
                  <li>
                    <strong>Tamanho Recomendado:</strong>
                    200x200
                  </li>
                  <li>
                    <strong>Formatos Aceitos:</strong>
                    png, jpg, gif e jpeg
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="custom">
          <div class="inputs cScroll">
            <div class="input">
              <label>Posição da Tag</label>
              <select ref="position_tag">
                <option value="insideImage" selected>Dentro da Imagem</option>
                <option value="beforeImage">Acima da Imagem</option>
                <option value="beforeTitle">Acima do titulo</option>
                <option value="afterPrice">Após o preço</option>
                <option value="afterBuy">Após o botão de compra</option>
              </select>
            </div>
            <div class="input" :data-field="'change_radius'">
              <label>Arredondamento</label>
              <select ref="rounded">
                <option value="4px" selected>Pouco Arredondado</option>
                <option value="30px">Muito Arredondado</option>
                <option value="0">Quadrado</option>
              </select>
            </div>
            <div class="input" :data-field="'change_width'">
              <label>Tamanho da Tag</label>
              <select ref="width">
                <option value="fit-content" selected>Mínimo Possível</option>
                <option value="100%">Máximo Possível</option>
              </select>
            </div>
            <hr />
            <div
              class="input"
              ref="background_color"
              data-type="backgroundColor"
            >
              <label>Cor do Fundo</label>
              <div class="input-picker">
                <input class="coloris" value="#f0f0f0" />
              </div>
            </div>
            <div class="input" ref="text_color" data-type="color">
              <label>Cor do Texto</label>
              <div class="input-picker">
                <input class="coloris" value="#000000" />
              </div>
            </div>
            <div
              class="input"
              ref="icon_color"
              data-type="fill"
              data-field="icon_color"
            >
              <label>Cor do Ícone</label>
              <div class="input-picker">
                <input class="coloris" value="#000000" />
              </div>
            </div>
            <hr />
            <div class="input">
              <label>Tipo da Borda</label>
              <select ref="border_type" data-type="borderStyle">
                <option value="none" selected>Nenhuma</option>
                <option value="solid">Sólida</option>
                <option value="dashed">Tracejada</option>
                <option value="dotted">Pontilhada</option>
              </select>
            </div>
            <div class="input" ref="border_width" data-type="borderWidth">
              <span class="input-title">
                <label>Espessura da borda</label>
                <small>1</small>
              </span>
              <input type="range" min="1" max="6" value="1" />
            </div>
            <div class="input" ref="border_color" data-type="borderColor">
              <label>Cor da Borda</label>
              <div class="input-picker">
                <input class="coloris" value="#000000" />
              </div>
            </div>
            <hr />
            <div class="input align" ref="align_horizontal">
              <label>Alinhamento Horizontal</label>
              <ul>
                <li :data-event="'flex-start'">
                  <i class="bx bx-align-left"></i>
                </li>
                <li :data-event="'center'">
                  <i class="bx bx-align-middle"></i>
                </li>
                <li :data-event="'flex-end'" class="active">
                  <i class="bx bx-align-right"></i>
                </li>
              </ul>
            </div>
            <div class="input align" ref="align_vertical">
              <label>Alinhamento Vertical</label>
              <ul>
                <li :data-event="'flex-end'">
                  <i class="bx bx-vertical-bottom"></i>
                </li>
                <li :data-event="'center'">
                  <i class="bx bx-reflect-horizontal"></i>
                </li>
                <li :data-event="'flex-start'" class="active">
                  <i class="bx bx-vertical-top"></i>
                </li>
              </ul>
            </div>
            <hr />
            <div class="input" ref="fontSize">
              <span class="input-title">
                <label>Tamanho da Fonte</label>
                <small>13</small>
              </span>
              <input type="range" min="8" max="32" value="11" />
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="actions">
          <div class="inputs cScroll">
            <div class="input" ref="action">
              <label>Ação</label>
              <select v-model="state.action">
                <option :value="value" v-for="{ name, value } in []">
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="input" data-action="whatsapp" ref="action_phone">
              <label>Número do Whatsapp</label>
              <input
                type="text"
                placeholder="Ex: 73 99999-9999"
                v-mask="['(##) ####-####', '(##) #####-####']"
              />
            </div>
            <div
              class="input"
              data-action="whatsapp"
              ref="action_phone_message"
            >
              <label>Texto da Mensagem</label>
              <input
                type="text"
                placeholder="Ex: Poderia me informar sobre o produto?"
              />
            </div>
            <div
              class="input"
              data-action="openPage"
              ref="action_link"
              data-field="input"
            >
              <label>Link da Página</label>
              <input type="text" placeholder="Ex: site.com" />
            </div>
            <div class="alert" v-if="getDescription(state.action, [])">
              {{ getDescription(state.action, []) }}
            </div>
            <hr />
            <div class="input" ref="only" data-field="select">
              <label>Filtrar Visitantes</label>
              <select v-model="state.only">
                <option :value="value" v-for="{ name, value } in []">
                  {{ name }}
                </option>
              </select>
            </div>
            <div class="alert" v-if="getDescription(state.only, [])">
              {{ getDescription(state.only, []) }}
            </div>
            <hr />
            <div class="input" ref="stock" data-field="select">
              <label>Filtrar Estoque</label>
              <select v-model="state.stock">
                <option :value="value" v-for="{ name, value } in []">
                  {{ name }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="salvar" ref="salvar_template">Salvar Tag</div>
    </section>
    <section class="product">
      <div ref="product">
        <span :data-store="'product-item-image'">
          <img :src="defaultImage" alt="produto" />
          <div ref="tag_container" class="label">
            <span ref="tag"></span>
            <img ref="tag_image" :src="logo_app" alt="app" />
          </div>
        </span>
        <div class="description" :data-store="'product-item-info'">
          <p>Camiseta Preta longa</p>
          <strong>R$ 23,00</strong>
        </div>
        <div class="pay">
          <button>Comprar</button>
          <button>Espiar</button>
        </div>
      </div>
    </section>
  </div>
</template>
