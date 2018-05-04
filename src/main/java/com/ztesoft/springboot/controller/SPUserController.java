package com.ztesoft.springboot.controller;

import com.ztesoft.springboot.common.Const;
import com.ztesoft.springboot.common.message.ResponseResult;
import com.ztesoft.springboot.service.SysUserService;
import com.ztesoft.springboot.utils.StringUtils;
import org.apache.commons.collections.MapUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("SPUserController")
@SuppressWarnings({"rawtypes", "unchecked"})
public class SPUserController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private SysUserService sysUserService;

    @RequestMapping(value = "/getCustName", method = RequestMethod.POST)
    public ResponseResult getCustName(@RequestBody Map<String, String> params, HttpSession httpSession)
            throws Exception {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        Map spUser = (Map) httpSession.getAttribute("spUser");
        if (spUser == null || StringUtils.isEmpty(MapUtils.getString(spUser, "user_id"))) {
            throw new Exception("未登录或者登录超时，请您重新登录!");
        }
        Map info = new HashMap();
        info.put("spuser", spUser);
        result.setResult(info);
        return result;
    }

    @RequestMapping(value = "/spUserLogin", method = RequestMethod.POST)
    public ResponseResult spUserLogin(@RequestBody Map<String, Object> params, HttpSession httpSession) {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        try {
            String user_name = MapUtils.getString(params, "user_name");
            String user_pwd = MapUtils.getString(params, "password");
            if (StringUtils.isEmpty(user_name) || StringUtils.isEmpty(user_pwd)) {
                result.setRes_code(Const.CODE_INFO.CODE_40000.getCode());
                result.setResult("校验失败，参数不能为空");
                return result;
            }
            List user_list = sysUserService.querySysUserList(params);
            if (com.ztesoft.springboot.utils.ListUtils.isEmpty(user_list)) {
                result.setRes_code(Const.CODE_INFO.CODE_40000.getCode());
                result.setResult("校验失败，无效账号");
                return result;
            }
            Map user_map = (Map) user_list.get(0);
            if (false && !user_pwd.equals(MapUtils.getString(user_map, "user_pwd"))) {
                result.setRes_code(Const.CODE_INFO.CODE_40000.getCode());
                result.setResult("校验失败，账号密码错误");
                return result;
            }

            List menu_list = sysUserService.querySysMenuList(params);
            user_map.put("user_menus", menu_list);
            user_map.put("is_need_pwd_notice", "false");
            result.setResult(user_map);
            httpSession.setAttribute("spUser", user_map);
        } catch (Exception e) {
            log.error("login fail", e);
            result.setRes_code(Const.CODE_INFO.CODE_40000.getCode());
            result.setResult(e.getMessage());
        }
        return result;
    }

    @RequestMapping(value = "/getPortalMenus", method = RequestMethod.POST)
    public List<Map> getPortalMenus(HttpSession httpSession) throws Exception {
        Map spUser = (Map) httpSession.getAttribute("spUser");
        List<Map> spuser_menu = (List<Map>) spUser.get("user_menus");
        if (spuser_menu != null && !spuser_menu.isEmpty()) {
            for (Map catalog : spuser_menu) {
                String parent_id = MapUtils.getString(catalog, "parent_id");
                if ("-1".equals(parent_id)) {
                    catalog.put("isParent", true);
                }
            }
        }
        return spuser_menu;
    }

    @RequestMapping(value = "/spUserLogout", method = RequestMethod.POST)
    public ResponseResult spUserLogout(HttpServletRequest request, HttpServletResponse response) {
        ResponseResult result = new ResponseResult(Const.CODE_INFO.CODE_00000);
        try {
            response.setHeader("Pragma", "No-cache");
            response.setHeader("Cache-Control", "no-cache");
            response.setDateHeader("Expires", 0);
            request.getSession().invalidate();
        } catch (Exception e) {
            log.error("login out fail", e);
            result.setRes_code(Const.CODE_INFO.CODE_40000.getCode());
            result.setResult(e.getMessage());
        }
        return result;
    }

}
