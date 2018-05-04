package com.ztesoft.springboot.utils;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.beanutils.PropertyUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 数组工具类
 */
@SuppressWarnings({"unchecked", "rawtypes"})
public class ListUtils {

    /**
     * 判断数组是否为空
     *
     * @param list
     * @return
     */
    public static boolean isEmpty(List<?> list) {
        return list == null || list.isEmpty();
    }

    /**
     * 判断数组是否为空
     *
     * @param list
     * @return
     */
    public static boolean isNotEmpty(List<?> list) {
        return !isEmpty(list);
    }

    /**
     * 返回列表长度
     *
     * @param list
     * @return
     */
    public static int length(List<?> list) {
        return isEmpty(list) ? 0 : list.size();
    }

    /**
     * 拷贝bean数组
     *
     * @param beans
     * @param clazz
     * @return
     */
    public static <T> List<T> toList(List<?> beans, Class<T> clazz) {
        List<T> list = new ArrayList<T>();
        if (isEmpty(beans)) {
            return list;
        }

        try {
            for (Object bean : beans) {
                T targetBean = clazz.newInstance();
                PropertyUtils.copyProperties(targetBean, bean);
                list.add(targetBean);
            }
        } catch (Exception e) {
            //log.error(e.getMessage(), e);
        }

        return list;
    }

    /**
     * 把bean数组转换成map数组
     *
     * @param beans
     * @return
     */
    public static List<Map<String, String>> toMap(List<?> beans) {
        List<Map<String, String>> mapList = new ArrayList<Map<String, String>>();

        if (isEmpty(beans)) {
            return mapList;
        }

        try {
            for (Object bean : beans) {
                Map<String, String> map = BeanUtils.describe(bean);
                mapList.add(map);
            }
        } catch (Exception e) {
            //log.error(e.getMessage(), e);
        }

        return mapList;
    }
}