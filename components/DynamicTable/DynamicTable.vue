<template>
  <v-data-table
    :headers="tableHeaders"
    :items="items"
    :loading="loading"
    disable-pagination
    disable-filtering
    disable-sort
    :items-per-page="40"
    :footer-props="{
      'disable-items-per-page': true
    }"
    hide-default-footer
  >
    <template v-for="(hkfsVal, hkfsIndex) in headersKeysForSlots" v-slot:[hkfsVal]="{ item, header }">
      <v-edit-dialog
        :key="`edit-dialog-${hkfsIndex}`"
        :return-value.sync="item[header.value]"
        :large="editable"
        :persistent="editable"
        cancel-text="Отмена"
        save-text="Сохранить"
        @save="save(item, header)"
        @cancel="cancel(item, header)"
        @open="open(item, header)"
        @close="close(item, header)"
      >
        <template v-slot:default>
          <div v-if="header.type === undefined || header.type === 'input'">
            {{ item[header.value] }}
          </div>
          <div v-if="header.type === 'reference'">
            <div v-if="referenceData[header.reference.entity] && item[header.value] !== undefined">
              <!-- TODO use identificator (header.reference.valueKey) instead of index (item[header.value]) -->
              <!--referenceData[header.reference.entity][item[header.value]][header.reference.textKey]-->
              {{
                objectFindBy(
                  referenceData[header.reference.entity].data,
                  header.reference.valueKey,
                  item[header.value]
                )[header.reference.textKey]
              }}
            </div>
            <div v-else>
              &mdash;
            </div>
          </div>
        </template>
        <template v-slot:input>
          <!-- eslint-disable-next-line -->
          <v-text-field
            v-if="header.type === undefined || header.type === 'input'"
            v-model="item[header.value]"
            :label="header.text"
            counter
            autofocus
            :disabled="!editable"
          ></v-text-field>

          <!-- eslint-disable-next-line -->
          <v-select
            v-if="header.type === 'reference'"
            v-model="item[header.value]"
            :multiple="header.multiple || false"
            :chips="header.chips || !!header.multiple"
            :label="header.text"
            :items="referenceData[header.reference.entity].data"
            :loading="referenceData[header.reference.entity].loading"
            :item-text="header.reference.textKey"
            :item-value="header.reference.valueKey"
            clearable
            :disabled="!editable"
          ></v-select>
        </template>
      </v-edit-dialog>
    </template>

    <template #item.removeActionColumn="{ item }">
      <v-btn
        icon
        color="error"
        @click="removeItemByIndex(items.indexOf(item))"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
    </template>

    <!-- https://ru.vuejs.org/v2/guide/components-slots.html#%D0%94%D0%B5%D1%81%D1%82%D1%80%D1%83%D0%BA%D1%82%D1%83%D1%80%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%B2%D1%85%D0%BE%D0%B4%D0%BD%D1%8B%D1%85-%D0%BF%D0%B0%D1%80%D0%B0%D0%BC%D0%B5%D1%82%D1%80%D0%BE%D0%B2-%D1%81%D0%BB%D0%BE%D1%82%D0%B0 -->
    <template v-slot:body.append="{ headers: slotHeaders }">
      <tr v-if="editable">
        <td :colspan="slotHeaders.length">
          <v-btn
            @click="appendItem"
          >
            <!-- eslint-disable-next-line -->
            <v-icon left>mdi-plus</v-icon> Добавить
          </v-btn>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'DynamicTable',
  props: {
    editable: {
      required: false,
      type: Boolean,
      default: true
    },
    headers: {
      required: true,
      type: Array
    },
    items: {
      required: true, // todo think about it
      type: Array
    },
    loading: {
      required: false,
      type: Boolean,
      default: false
    },
    referenceData: {
      required: false,
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  computed: {
    headersForSlots () {
      const result = {}
      for (const key in this.headers) {
        if (this.headers[key].multiple !== true) {
          result[`item.${this.headers[key].value}`] = this.headers[key]
        }
      }
      return result
    },
    tableHeaders () {
      return [
        ...this.headers,
        { text: '', value: 'removeActionColumn' }
      ]
    },
    headersKeysForSlots () {
      const result = []
      for (const key in this.headers) {
        if (this.headers[key].multiple !== true) {
          result.push(`item.${this.headers[key].value}`)
        }
      }
      return result
    }
  },
  methods: {
    save (item, header) {
      // console.log('save', item, header)
    },
    cancel (item, header) {
      // console.log('cancel', item, header)
    },
    open (item, header) {
      // console.log('open', item, header)
    },
    close (item, header) {
      // console.log('close', item, header)
    },
    appendItem () {
      const newItem = {}
      for (const key in this.headers) {
        newItem[this.headers[key].value] = undefined
      }
      const items = this.items
      items.push(newItem)
      this.$emit('update:items', items)
    },
    objectFindBy (associativeArray, key, value) {
      return associativeArray.find((aaValue, aaIndex, aaObj) => {
        return aaValue[key] === value
      })
    },
    removeItemByIndex (index) {
      this.items.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
