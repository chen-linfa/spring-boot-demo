package com.ztesoft.springboot.controller;

import com.ztesoft.springboot.domain.AttrValue;
import com.ztesoft.springboot.utils.ListUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("CacheController")
@SuppressWarnings({"rawtypes", "unchecked"})
public class CacheController {

    @RequestMapping(value = "/getMultiAttrValues", method = RequestMethod.POST)
    public Map<String, List<AttrValue>> getMultiAttrValues(@RequestBody List<String> attrCodes)
            throws Exception {
        if (ListUtils.isEmpty(attrCodes)) {
            return Collections.emptyMap();
        }
        Map<String, List<AttrValue>> multiAttrValues = new HashMap<String, List<AttrValue>>();

        String attr_code = attrCodes.get(0);
        if ("TRIGGER_STATE".equals(attr_code)) {
            List<AttrValue> list = new ArrayList<AttrValue>();
            AttrValue attr_1 = new AttrValue();
            attr_1.setAttr_value("WAITING");
            attr_1.setAttr_value_name("等待");

            AttrValue attr_2 = new AttrValue();
            attr_2.setAttr_value("ACQUIRED");
            attr_2.setAttr_value_name("运行");

            AttrValue attr_3 = new AttrValue();
            attr_3.setAttr_value("COMPLETE");
            attr_3.setAttr_value_name("完成");

            AttrValue attr_4 = new AttrValue();
            attr_4.setAttr_value("PAUSED");
            attr_4.setAttr_value_name("暂停");

            AttrValue attr_5 = new AttrValue();
            attr_5.setAttr_value("BLOCKED");
            attr_5.setAttr_value_name("阻塞");

            AttrValue attr_6 = new AttrValue();
            attr_6.setAttr_value("PAUSED_BLOCKED");
            attr_6.setAttr_value_name("暂停阻塞 ");

            AttrValue attr_7 = new AttrValue();
            attr_7.setAttr_value("ERROR");
            attr_7.setAttr_value_name("错误");

            list.add(attr_1);
            list.add(attr_2);
            list.add(attr_3);
            list.add(attr_4);
            list.add(attr_5);
            list.add(attr_6);
            list.add(attr_7);

            multiAttrValues.put("TRIGGER_STATE", list);
        }

        return multiAttrValues;
    }

}
