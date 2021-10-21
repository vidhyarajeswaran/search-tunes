import { mount } from '@vue/test-utils'
import Vue from 'vue'
import SearchTunes from '@/components/SearchTunes'

jest.mock('axios')

describe('SearchTunes.vue', () => {
  it('should render correct contents with initial layout', () => {
    const Constructor = Vue.extend(SearchTunes)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.header').textContent).toEqual('iTunes Search')
    expect(vm.$el.querySelector('.warning').textContent).toEqual('There is no data available')
  })

  it('should get data for the artist', async () => {
    const onSubmit = jest.fn()
    const wrapper = mount(SearchTunes, {
      methods: {
        onSubmit
      }
    })

    wrapper.find('.input-artist').setValue('someone')
    await wrapper.vm.$nextTick()
    wrapper.find('.search-button').trigger('click')
    await wrapper.vm.$nextTick()
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should filter albums for the artist', async () => {
    const onChange = jest.fn()
    const wrapper = mount(SearchTunes, {
      methods: {
        onChange
      }
    })
    wrapper.find('.filter-albums').trigger('keyup')
    await wrapper.vm.$nextTick()
    expect(onChange).toHaveBeenCalled()
  })
})
