# 1 、Spring

## 1.1、简介

## 1.2、优点

##### Spring是一个开源的免费的框架（容器）！

##### Spring是一个轻量级的、非入侵式的框架！

##### 控制反转（IOC）、面向切面编程（AOP）！

##### 支持事务的处理，对框架整合的支持！

##### == 总结：Spring就是一个轻量级的控制反转（IOC）和面向切面编程（AOP）的框架！ ==

## 1.3、组成

```
<dependency>
<groupId>org.springframework</groupId>
<artifactId>spring-webmvc</artifactId>
<version>5.3.18</version>
</dependency>
```
```
<!-- spring操作数据库 -->
<dependency>
<groupId>org.springframework</groupId>
<artifactId>spring-jdbc</artifactId>
<version>5.3.19</version>
</dependency>
```
###### 1 2 3 4 5 6 7 8 9

###### 10

###### 11

###### 12


## 1.4、扩展


# 2 、IOC理论推导

## 2.1、传统开发

##### 1. UserDao 接口

##### 2. UserDaoImpl 实现类

##### 3. UserService 业务接口

##### 4. UserServiceImpl 业务实现类

##### 在传统开发中当Dao层的实现类增多时，在Service层的业务实现类中需要不断地修改代码（不断new

##### dao接口）！

##### 使用一个set接口实现，已经发生了革命性的变化！

##### 之前，程序是主动创建对象！控制权在程序员手上！

```
// 利用set进行动态实现值的注入！
public void setUserDao(UserDao userDao){
this.userDao = userDao;
}
```
###### 1

###### 2

###### 3

###### 4


##### 使用了set注入以后，程序员不再具有主动性，而是变成了被动地接受对象！

##### 这种思想，从本质上解决了问题，我们程序员不用再去管理对象的创建了。系统的耦合性大大降低，可

##### 以更加专注再业务的实现上！这是IOC的原型！

## 2.2、IOC本质

##### 控制反转IoC(Inversion of Control)，是一种设计思想 ，DI(依赖注入)是实现IoC的一种方法，也

##### 有人认为DI只是IoC的另一种说法。没有IoC的程序中 , 我们使用面向对象编程 , 对象的创建与对象间的

##### 依赖关系完全硬编码在程序中，对象的创建由程序自己控制，控制反转后将对象的创建转移给第三方

##### ioc容器，个人认为所谓控制反转就是： 获得依赖对象的方式反转了。

##### 采用XML方式配置Bean的时候，Bean的定义信息是和实现分离的，而采用注解的方式可以把两者合为

##### 一体，Bean的定义信息直接以注解的形式定义在实现类中，从而达到了零配置的目的。

##### 控制反转是一种通过描述(XML或注解)并通过第三方去生产或获取特定对象的方式。在Spring中实现控

##### 制反转的是IoC容器，其实现方法是依赖注入(Dependency Injection,DI)


# 3 、helloSpring

##### 1 、导入jar包

##### 注 : spring 需要导入commons-logging进行日志记录. 我们利用maven , 他会自动下载对应的依赖项.

##### 2 、编写代码

##### 1 、编写一个Hello实体类

##### 3 、编写我们的spring文件 , 这里我们命名为beans.xml

##### 4 、我们可以去进行测试了.

```
<dependency>
<groupId>org.springframework</groupId>
<artifactId>spring-webmvc</artifactId>
<version>5.1.10.RELEASE</version>
</dependency>
```
###### 1

###### 2

###### 3

###### 4

###### 5

```
public class Hello {
private String name;
```
```
public String getName() {
return name;
}
public void setName(String name) {
this.name = name;
}
public void show(){
System.out.println("Hello,"+ name );
}
}
```
###### 1 2 3 4 5 6 7 8 9

###### 10

###### 11

###### 12

###### 13

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xsi:schemaLocation="http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans.xsd">
```
```
<!--bean就是java对象 , 由Spring创建和管理
控制：原先由程序员来new对象，现在由spring来托管
-->
<bean id="hello" class="com.kuang.pojo.Hello">
<property name="name" value="Spring"/>
</bean>
```
```
</beans>
```
###### 1 2 3 4 5 6 7 8 9

###### 10

###### 11

###### 12

###### 13

###### 14

###### 15


##### 思考：

##### 这个过程就叫控制反转 :

##### 依赖注入 : 就是利用set方法来进行注入的.

##### IOC是一种编程思想，由主动的编程变成被动的接收

##### 可以通过newClassPathXmlApplicationContext去浏览一下底层源码.

##### 到了现在，我们彻底不用在程序中去改动了，要实现不同的操作，只需要在xml配置文件中进行修改。

##### 所谓的IoC,一句话搞定 : 对象由Spring 来创建 , 管理 , 装配!

# 4 、IOC创建对象地方式

```
@Test
public void test(){
//解析beans.xml文件 , 生成管理相应的Bean对象
ApplicationContext context = new
ClassPathXmlApplicationContext("beans.xml");
// 反转：从前需要new对象，而现在变成了被动地接受对象：getBean("hello")
//getBean : 参数即为spring配置文件中bean的id.
Hello hello = (Hello) context.getBean("hello");
hello.show();
}
```
###### 1 2 3 4 5 6 7 8 9

```
Hello 对象是谁创建的?
hello 对象是由Spring创建的
Hello 对象的属性是怎么设置的?
hello 对象的属性是由Spring容器设置的
```
###### 1

###### 2

###### 3

###### 4

```
控制 : 谁来控制对象的创建 , 传统应用程序的对象是由程序本身控制创建的 , 使用Spring后 , 对
象是由Spring来创建的
反转 : 程序本身不创建对象 , 而变成被动的接收对象.
```
###### 1

###### 2


# 5 、Spring的配置

## 5.1、别名

## 5.2、Bean的配置

## 5.3、import


# 6 、依赖注入

## 6.1、构造器注入

##### 前面已经说过

## 6.2、set方式注入【重点】

##### 依赖注入：set注入！

##### 依赖：bean对象的创建依赖于容器

##### 注入：bean对象中所有的属性，由容器来注入！


##### 复杂类型注入：



### 6.3、拓展方式注入


### 6.4、bean的作用域


# 7 、自动装配


##### byname：找people中set方法的值 和 已注册的bean的id相同；

##### bytype：找people中set方法的属性值 和 已注册的bean的class相同。

### 7.4、注解实现自动装配



##### 执行顺序：@Atuowired：bytype-->byname;

##### @Resource:byname-->bytype.

# 8 、使用注解开发

##### 1 、bean注入



# 9 、使用java的方式配置

# spring【springboot中使用】

##### 实体类：


##### 配置类：

##### 测试类：


# 总结IOC

##### ioc三个核心：

##### 1 、所有的类都需要装配到bean里面；

##### 2 、所有的bean都需要通过spring容器去取；

##### 3 、所有从容器中取出来的bean，都成一个对象的实例，最终调用该实例的方法即可使用。

# 10 、代理模式

## 10.1、静态代理


##### 3 、代理角色：



### 10.2、加深理解

##### 聊聊aop

### 10.3、动态代理



# 11 、AOP

## 11.1、什么是AOP

## 11.2、AOP在Spring中的作用


### 11.3、使用Spring实现AOP


#### 方式一：AOP原生sring API接口



#### 方式二：自定义类


#### 方式三：注解方式


# 12 、整合mybatis和spring

##### 将mybatis托给spring管理：

##### 实体类Stock：

##### 接口StockMappper：

```
<!-- daraSource：使用Spring的数据源代替mybatis的配置
我们这里使用Spring提供的JDBC：org.springframework.jdbc.datasource
-->
<bean id="dataSource"
class="org.springframework.jdbc.datasource.DriverManagerDataSource">
<property name="driverClassName" value="com.mysql.cj.jdbc.Driver"/>
<property name="url" value="jdbc:mysql://localhost:3306/sale_book?
useUnicode=true&amp;characterEncoding=UTF-
8&amp;serverTimezone=Asia/Shanghai"/>
<property name="username" value="root"/>
<property name="password" value="456dcr"/>
</bean>
```
```
<!-- sqlSessionFactory -->
<bean id="sqlSessionFactory"
class="org.mybatis.spring.SqlSessionFactoryBean">
<property name="dataSource" ref="dataSource"/>
<!-- 绑定mybatis配置文件 -->
<property name="configLocation" value="classpath:mybatis-config.xml"/>
<property name="mapperLocations"
value="classpath:com/wzx/mapper/*.xml"/>
</bean>
```
```
<!-- sqlSession -->
<bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
<constructor-arg index="0" ref="sqlSessionFactory"/>
</bean>
```
###### 1 2 3 4 5 6 7 8 9

###### 10

###### 11

###### 12

###### 13

###### 14

###### 15

###### 16

###### 17

###### 18

###### 19

###### 20

###### 21

###### 22

```
@Data
@AllArgsConstructor // 无参构造
@NoArgsConstructor // 有参构造
public class Stock {
private int id;
private String status;
private int num;
}
```
###### 1 2 3 4 5 6 7 8


##### 执行sql语句：

##### 接口实现类：

##### 注册bean：

```
public interface StockMapper {
List<Stock> selectStock();
```
###### // 出售一本书:

###### // 库存-1

```
int updateStock(int num);
// 销售+1
int updateSale(int num);
}
```
###### 1 2 3 4 5 6 7 8 9

```
<mapper namespace="com.wzx.mapper.StockMapper">
<update id="updateStock" parameterType="int">
update sale_book.stock set num = num + #{num} where id = 1
</update>
<update id="updateSale" parameterType="int">
update sale_book.stock set num = num - #{num} where id = 2
</update>
</mapper>
```
###### 1 2 3 4 5 6 7 8

```
// SqlSessionDaoSupport是一个抽象的类，用来直接获取sqlSession
public class StockMapperImpl extends SqlSessionDaoSupport implements
StockMapper{
```
```
@Override
public List<Stock> selectStock() {
StockMapper mapper = getSqlSession().getMapper(StockMapper.class);
mapper.updateStock( 2 );
mapper.updateSale( 2 );
```
```
return null;
}
```
```
@Override
public int updateStock(int num) {
return
getSqlSession().getMapper(StockMapper.class).updateStock(num);
}
```
```
@Override
public int updateSale(int num) {
return
getSqlSession().getMapper(StockMapper.class).updateSale(num);
}
}
```
###### 1 2 3 4 5 6 7 8 9

###### 10

###### 11

###### 12

###### 13

###### 14

###### 15

###### 16

###### 17

###### 18

###### 19

###### 20

###### 21

###### 22

```
<bean id="stockMapper" class="com.wzx.mapper.StockMapperImpl">
<property name="sqlSessionFactory" ref="sqlSessionFactory"/>
</bean>
```
###### 1

###### 2

###### 3


##### 测试：

# 13 、声明式事务

```
ApplicationContext context = new
ClassPathXmlApplicationContext("applicationContext.xml");
StockMapper stockMapper = context.getBean("stockMapper", StockMapper.class);
```
```
List<Stock> stockList = stockMapper.selectStock();
```
```
for(Stock stock : stockList){
System.out.println(stock);
}
```
###### 1 2 3 4 5 6 7 8

###### <!-- 配置声明式事务 -->

```
<bean id="transactionManager"
class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
<property name="dataSource" ref="dataSource"/>
</bean>
<!-- 结合aop实现事务的织入 -->
<!-- 配置事务的通知 -->
<tx:advice id="txtAdvice" transaction-manager="transactionManager">
<!-- 给那些方法配置事务 -->
<tx:attributes>
<tx:method name="*" propagation="REQUIRED"/>
</tx:attributes>
</tx:advice>
<!-- 配置事务切入 -->
<aop:config>
<aop:pointcut id="txtPointCut" expression="execution(*
com.wzx.mapper.*.*(..))"/>
<aop:advisor advice-ref="txtAdvice" pointcut-ref="txtPointCut"/>
</aop:config>
```
###### 1 2 3 4 5 6 7 8 9

###### 10

###### 11

###### 12

###### 13

###### 14

###### 15

###### 16

###### 17


# 14 、总结

##### spring：一个IOC和AOP框架

##### IOC：控制反转

##### 控制：创建对象的权力由程序本身交给spring容器；

##### 反转：程序从主动创建对象到被动地接受对象。

##### 个人理解：将new对象交给spring来做（xml配置 / 注解方式实现），另外di注入也是ioc地一种实

##### 现方法。

##### AOP:面向切面

##### 实际上是一种动态代理地过程，在以下过程中：

##### 相当于为VisitServiceImpl接口创建了一个动态代理，接着我们就可以通过

##### 如上形式为业务添加一些额外地功能而不修改原代码。

```
<aop:pointcut id="point" expression="execution(*
com.wzx.service.impl.VisitServiceImpl.*(..))"/>
```
###### 1

###### <!--通知-->

```
<aop:after method="afterAdvice" pointcut-ref="point"/>
<aop:after-returning method="returnAdvice" pointcut-ref="point"/>
<aop:after-throwing method="errAdvice" pointcut-ref="point"/>
```
###### 1

###### 2

###### 3

###### 4


