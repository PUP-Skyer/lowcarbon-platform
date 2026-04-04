// 低碳生活数字化管理平台 - 模拟数据集
import { api } from '../utils/api'

export const mockDataSets: Record<string, { columns: string[], rows: Record<string, any>[] }> = {
  // 各场景碳排放量对比（堆叠柱状图）
  'scene-emission': {
    columns: ['场景', '直接排放', '间接排放', '碳抵消'],
    rows: [
      { '场景': '绿色出行', '直接排放': 12, '间接排放': 5, '碳抵消': 18 },
      { '场景': '低碳饮食', '直接排放': 25, '间接排放': 8, '碳抵消': 10 },
      { '场景': '绿色消费', '直接排放': 18, '间接排放': 12, '碳抵消': 8 },
      { '场景': '节能居家', '直接排放': 30, '间接排放': 15, '碳抵消': 22 },
      { '场景': '绿色办公', '直接排放': 8, '间接排放': 6, '碳抵消': 12 },
    ],
  },
  // 碳积分来源分布（环形图）
  'credit-source': {
    columns: ['来源', '积分量'],
    rows: [
      { '来源': '绿色出行', '积分量': 3500 },
      { '来源': '低碳饮食', '积分量': 2200 },
      { '来源': '节能居家', '积分量': 1800 },
      { '来源': '绿色消费', '积分量': 1200 },
      { '来源': '绿色办公', '积分量': 800 },
      { '来源': '活动奖励', '积分量': 500 },
    ],
  },
  // 用户行为与碳排放关系（散点图）
  'behavior-emission': {
    columns: ['用户', '低碳行为次数', '碳排放量(kg)'],
    rows: [
      { '用户': '用户A', '低碳行为次数': 85, '碳排放量(kg)': 32 },
      { '用户': '用户B', '低碳行为次数': 62, '碳排放量(kg)': 48 },
      { '用户': '用户C', '低碳行为次数': 95, '碳排放量(kg)': 25 },
      { '用户': '用户D', '低碳行为次数': 40, '碳排放量(kg)': 65 },
      { '用户': '用户E', '低碳行为次数': 78, '碳排放量(kg)': 38 },
      { '用户': '用户F', '低碳行为次数': 55, '碳排放量(kg)': 52 },
      { '用户': '用户G', '低碳行为次数': 90, '碳排放量(kg)': 28 },
      { '用户': '用户H', '低碳行为次数': 35, '碳排放量(kg)': 70 },
      { '用户': '用户I', '低碳行为次数': 72, '碳排放量(kg)': 42 },
      { '用户': '用户J', '低碳行为次数': 48, '碳排放量(kg)': 58 },
    ],
  },
  // 低碳排行榜（横向柱状图）
  'lowcarbon-rank': {
    columns: ['团队', '减碳量(吨)'],
    rows: [
      { '团队': '班级A', '减碳量(吨)': 80 },
      { '团队': '社区B', '减碳量(吨)': 70 },
      { '团队': '城市C', '减碳量(吨)': 60 },
      { '团队': '企业D', '减碳量(吨)': 55 },
      { '团队': '校园E', '减碳量(吨)': 45 },
    ],
  },
  // 用户低碳表现（雷达图）
  'user-performance': {
    columns: ['维度', '用户A', '用户B', '用户C'],
    rows: [
      { '维度': '绿色出行', '用户A': 92, '用户B': 75, '用户C': 88 },
      { '维度': '低碳饮食', '用户A': 85, '用户B': 90, '用户C': 70 },
      { '维度': '节能居家', '用户A': 78, '用户B': 82, '用户C': 95 },
      { '维度': '绿色消费', '用户A': 88, '用户B': 68, '用户C': 80 },
      { '维度': '绿色办公', '用户A': 72, '用户B': 85, '用户C': 76 },
    ],
  },
  // 低碳活动转化率（漏斗图）
  'activity-funnel': {
    columns: ['阶段', '人数'],
    rows: [
      { '阶段': '浏览活动', '人数': 980 },
      { '阶段': '了解详情', '人数': 520 },
      { '阶段': '报名参与', '人数': 270 },
      { '阶段': '实际参与', '人数': 185 },
      { '阶段': '持续参与', '人数': 120 },
    ],
  },
  // 用户碳足迹变化趋势（折线图）
  'footprint-trend': {
    columns: ['日期', '人均碳排放(kg)', '人均碳减排(kg)', '活跃用户'],
    rows: [
      { '日期': '1月', '人均碳排放(kg)': 45, '人均碳减排(kg)': 12, '活跃用户': 3200 },
      { '日期': '2月', '人均碳排放(kg)': 42, '人均碳减排(kg)': 15, '活跃用户': 3800 },
      { '日期': '3月', '人均碳排放(kg)': 38, '人均碳减排(kg)': 18, '活跃用户': 4200 },
      { '日期': '4月', '人均碳排放(kg)': 35, '人均碳减排(kg)': 22, '活跃用户': 5100 },
      { '日期': '5月', '人均碳排放(kg)': 32, '人均碳减排(kg)': 25, '活跃用户': 5800 },
      { '日期': '6月', '人均碳排放(kg)': 28, '人均碳减排(kg)': 30, '活跃用户': 6500 },
      { '日期': '7月', '人均碳排放(kg)': 25, '人均碳减排(kg)': 33, '活跃用户': 7200 },
      { '日期': '8月', '人均碳排放(kg)': 22, '人均碳减排(kg)': 36, '活跃用户': 7800 },
      { '日期': '9月', '人均碳排放(kg)': 20, '人均碳减排(kg)': 38, '活跃用户': 8200 },
      { '日期': '10月', '人均碳排放(kg)': 18, '人均碳减排(kg)': 42, '活跃用户': 8500 },
      { '日期': '11月', '人均碳排放(kg)': 15, '人均碳减排(kg)': 45, '活跃用户': 8800 },
      { '日期': '12月', '人均碳排放(kg)': 13, '人均碳减排(kg)': 48, '活跃用户': 9200 },
    ],
  },
  // 社区碳排放密度分布（热力图）
  'community-heatmap': {
    columns: ['社区', '1月', '2月', '3月', '4月', '5月', '6月'],
    rows: [
      { '社区': '阳光社区', '1月': 85, '2月': 78, '3月': 72, '4月': 65, '5月': 58, '6月': 52 },
      { '社区': '翠湖花园', '1月': 72, '2月': 68, '3月': 60, '4月': 55, '5月': 48, '6月': 42 },
      { '社区': '绿洲小区', '1月': 90, '2月': 82, '3月': 75, '4月': 68, '5月': 62, '6月': 55 },
      { '社区': '碧水湾', '1月': 65, '2月': 60, '3月': 55, '4月': 48, '5月': 42, '6月': 38 },
      { '社区': '青山居', '1月': 78, '2月': 72, '3月': 65, '4月': 58, '5月': 52, '6月': 45 },
      { '社区': '紫荆苑', '1月': 88, '2月': 80, '3月': 73, '4月': 66, '5月': 60, '6月': 53 },
      { '社区': '学府社区', '1月': 60, '2月': 55, '3月': 50, '4月': 45, '5月': 40, '6月': 35 },
    ],
  },
  // 平台核心运营数据（KPI）
  'kpi-registered': {
    columns: ['指标', '值'],
    rows: [
      { '指标': '注册用户数', '值': 7403 },
    ],
  },
  'kpi-active': {
    columns: ['指标', '值'],
    rows: [
      { '指标': '活跃用户数', '值': 5470 },
    ],
  },
  'kpi-reduction': {
    columns: ['指标', '值'],
    rows: [
      { '指标': '累计碳减排', '值': 1884 },
    ],
  },
  'gauge-target': {
    columns: ['指标', '值'],
    rows: [
      { '指标': '年度减碳目标完成率', '值': 78.5 },
    ],
  },
}

export function getMockData(dataSource: string) {
  return mockDataSets[dataSource] || { columns: [], rows: [] }
}

// dataSource 与 API 调用函数的映射
const apiCallMap: Record<string, () => Promise<any>> = {
  'scene-emission': api.sceneEmission,
  'credit-source': api.creditSource,
  'behavior-emission': api.userCarbon,
  'footprint-trend': api.footprintTrend,
  'activity-funnel': api.activityFunnel,
  'community-heatmap': api.communityHeatmap,
  'lowcarbon-rank': api.lowcarbonRank,
  'user-performance': api.userPerformance,
}

// 字段映射配置：API驼峰字段 -> 前端中文字段名
const fieldMappings: Record<string, Record<string, string>> = {
  'scene-emission': {
    sceneName: '场景',
    directEmission: '直接排放',
    indirectEmission: '间接排放',
    carbonOffset: '碳抵消',
  },
  'credit-source': {
    sourceName: '来源',
    creditAmount: '积分量',
  },
  'behavior-emission': {
    userName: '用户',
    lowcarbonActions: '低碳行为次数',
    carbonEmission: '碳排放量(kg)',
  },
  'footprint-trend': {
    month: '日期',
    avgEmission: '人均碳排放(kg)',
    avgReduction: '人均碳减排(kg)',
    activeUsers: '活跃用户',
  },
  'activity-funnel': {
    stageName: '阶段',
    userCount: '人数',
  },
  'lowcarbon-rank': {
    name: '团队',
    totalReduction: '减碳量(吨)',
  },
  'user-performance': {
    dimension: '维度',
    userA: '用户A',
    userB: '用户B',
    userC: '用户C',
  },
}

// 通用字段映射转换
function mapFields(
  rawData: Record<string, any>[],
  mapping: Record<string, string>
): Record<string, any>[] {
  return rawData.map(item => {
    const mapped: Record<string, any> = {}
    for (const [apiField, cnField] of Object.entries(mapping)) {
      if (item[apiField] !== undefined) {
        mapped[cnField] = item[apiField]
      }
    }
    return mapped
  })
}

// community-heatmap 特殊处理：行格式 -> 列格式（pivot）
function pivotCommunityHeatmap(
  rawData: { communityName: string; month: string; emissionIndex: number }[]
): { columns: string[]; rows: Record<string, any>[] } {
  // 收集所有月份（去重、排序）
  const monthSet = new Set<string>()
  const communityMap = new Map<string, Record<string, any>>()

  for (const item of rawData) {
    monthSet.add(item.month)
    if (!communityMap.has(item.communityName)) {
      communityMap.set(item.communityName, { '社区': item.communityName })
    }
    communityMap.get(item.communityName)![item.month] = item.emissionIndex
  }

  const months = Array.from(monthSet)
  const columns = ['社区', ...months]
  const rows = Array.from(communityMap.values())

  return { columns, rows }
}

/**
 * 从API获取真实数据，失败时回退到mock数据
 * @param dataSource 数据源标识
 * @returns { columns: string[], rows: Record<string, any>[] }
 */
export async function fetchRealData(
  dataSource: string
): Promise<{ columns: string[]; rows: Record<string, any>[] }> {
  try {
    // KPI 类型的 dataSource 不走此函数，由 KpiCard 组件直接调用 api.kpi()
    const apiCaller = apiCallMap[dataSource]
    if (!apiCaller) {
      // 没有对应API的数据源（如 kpi-registered, gauge-target），回退到mock
      return getMockData(dataSource)
    }

    const rawData = await apiCaller()

    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return getMockData(dataSource)
    }

    // community-heatmap 特殊处理：行转列
    if (dataSource === 'community-heatmap') {
      return pivotCommunityHeatmap(rawData)
    }

    // 通用字段映射
    const mapping = fieldMappings[dataSource]
    if (!mapping) {
      return getMockData(dataSource)
    }

    const mappedRows = mapFields(rawData, mapping)
    const columns = Object.keys(mapping)

    return { columns, rows: mappedRows }
  } catch (e) {
    console.warn('API不可用，使用模拟数据:', e)
    return getMockData(dataSource)
  }
}
