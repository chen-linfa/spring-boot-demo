package com.ztesoft.springboot.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

/**
 * Redis集群交由spring-boot通过配置文件管理
 */
@Configuration
public class RedisClusterConfig {
    @Value("${redis.maxTotal}")
    private String maxTotal;

    @Value("${redis.maxIdel}")
    private String maxIdel;

    @Value("${redis.maxWaitMillis}")
    private String maxWaitMillis;

    @Value("${redis.testOnBorrow}")
    private String testOnBorrow;

    @Value("${redis.testOnReturn}")
    private String testOnReturn;

    @Value("${redis.serverList}")
    private String serverList;

    /**
     * Jedis
     */
    //@Bean
    /*public JedisCluster getJedisCluster() {
        String[] serverArray = serverList.split(",");
        Set<HostAndPort> nodes = new HashSet<HostAndPort>();
        for (String server : serverArray) {
            String[] sp = server.split(":");
            nodes.add(new HostAndPort(sp[0], Integer.parseInt(sp[1])));
        }
        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxIdle(Integer.parseInt(maxIdel));
        poolConfig.setMaxTotal(Integer.parseInt(maxTotal));
        poolConfig.setTestOnBorrow("true".equals(testOnBorrow));
        poolConfig.setTestOnReturn("true".equals(testOnReturn));
        JedisCluster jedisCluster = new JedisCluster(nodes, poolConfig);
        return jedisCluster;
    }*/
    //@Bean
    /*public RedisConnectionFactory redisConnectionFactory() {
        List<String> nodes = Arrays.asList("127.0.0.1:6379", "127.0.0.1:6380", "127.0.0.1:6381");
        RedisClusterConfiguration configuration = new RedisClusterConfiguration(nodes);
        JedisConnectionFactory factory = new JedisConnectionFactory(configuration);
        return factory;
    }*/

    /**
     * Lettuce
     */
   /* @Bean
    public RedisConnectionFactory lettuceConnectionFactory() {
        RedisSentinelConfiguration sentinelConfig = new RedisSentinelConfiguration()
                .master("mymaster")
                .sentinel("127.0.0.1", 6379)
                .sentinel("127.0.0.1", 6380)
                .sentinel("127.0.0.1", 6381);
        return new LettuceConnectionFactory(sentinelConfig);
    }*/
}

