// Libraries
import Vuetify from 'vuetify';

import Landing from '@/components/Landing';
import { shallowMount } from '@vue/test-utils'

// Utilities
import { createLocalVue, mount } from '@vue/test-utils'

describe('Landing.vue', () => {
  const localVue = createLocalVue();
  let vuetify;

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('should render correct contents', () => {
    const msg = 'CoderBot';
    const wrapper = shallowMount(Landing, {
      propsData: { msg }
    })
    expect(wrapper.find('.logo').text()).toMatch(msg);
  });
});
