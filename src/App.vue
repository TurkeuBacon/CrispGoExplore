<template>
  <div>
    <div class="w-full h-64 px-8 text-green9 font-medium text-sm">
      <SplitterGroup
        id="splitter-group-1"
        direction="horizontal"
      >
        <SplitterPanel
          id="splitter-group-1-panel-1"
          :min-size="20"
          class="bg-white rounded-xl flex items-center justify-center"
        >
          Panel A
        </SplitterPanel>
        <SplitterResizeHandle
          id="splitter-group-1-resize-handle-1"
          class="w-2"
        />
        <SplitterPanel
          id="splitter-group-1-panel-2"
          :min-size="20"
        >
          <SplitterGroup
            id="splitter-group-2"
            direction="vertical"
          >
            <SplitterPanel
              id="splitter-group-2-panel-1"
              :min-size="20"
              class="bg-white rounded-xl flex items-center justify-center"
            >
              Panel B
            </SplitterPanel>
            <SplitterResizeHandle
              id="splitter-group-2-resize-handle-1"
              class="h-2"
            />
            <SplitterPanel
              id="splitter-group-2-panel-2"
              :min-size="20"
              class="bg-white rounded-xl flex items-center justify-center"
            >
              Panel C
            </SplitterPanel>
          </SplitterGroup>
        </SplitterPanel>
      </SplitterGroup>
    </div>
    <Monitor style="height: 100%" />
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { SplitterGroup, SplitterPanel, SplitterResizeHandle } from 'radix-vue';
import Monitor from './components/monitor/Monitor.vue'

export default ({
  setup() {
    const { height, width } = useWindowSize();

    return {
      height, width
    }
  }
})
</script>


