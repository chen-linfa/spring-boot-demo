package com.ztesoft.springboot.service;

import com.ztesoft.springboot.common.PageModel;
import com.ztesoft.springboot.utils.DaoUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@SuppressWarnings({"rawtypes", "unchecked"})
public class SysUserService {

    @Transactional
    public List querySysUserList(Map params) {
        return DaoUtils.getSqlTpl().selectList("SysUser.querySysUser", params);
    }

    @Transactional
    public PageModel querySysUser(Map params) {
        return DaoUtils.selectPageModel("SysUser.querySysUser", params, 1, 10);
    }

    @Transactional
    public List querySysMenuList(Map params) {
        return DaoUtils.getSqlTpl().selectList("SysUser.querySysMenu", params);
    }
}
