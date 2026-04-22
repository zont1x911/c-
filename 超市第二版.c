#include <stdio.h>
#include <string.h>
#define DATA_FILE "product.dat"
struct Date{
	int year;
	int mouth;
	int day;
};
struct product{
	int id;
	char name[100];
	char category[50];
	float price;
	int stock;
	struct Date produceDate;
};
struct caritem
{
	int productid;
	char name[50];
	float price;
	int quantity;
 } ;
struct product product[100];
struct caritem cart[100];

void usermenu();//客户 
void attendant();//管理员 
void addtocart();
void showcart();
void showmenu();
void clearCart();
void addproduct();
void showproductbycategory();
void showProductsForCustomer();
void checkout();
void showall();
void deleteProduct();
void updateproduct();
void findproduct();
void saveTofile();
void loadfromfile();
void loainuser();
int findproductindexbyid(int id);
int cartcount = 0;// 商品种类并非商品总数 
int count = 0;
int usertype = 0; 
int main()
{
	printf("\n============超市系统===============\n");
	printf("1.管理员系统\r\n");
	printf("2.用户端\r\n");
	printf("0.退出\r\n");
	printf("请选择：\r\n");

	int p;
	while(1)
	{
		scanf("%d",&p);
		switch(p)
		{
			case 1:
				attendant();
				break;
			case 2:
				usermenu();
				break;
			case 0:
				printf("thanks\r\n");
				return 0;
			default:
				printf("error\r\n");
		}
	}
	return 0;
}


void usermenu()
{

	int f;
	while(1)
	{
		printf("\n============用户端==============\n");
		
		if(usertype == 0)
		{
			printf("未登录\r\n");
		 } 
		else if(usertype == 1)
		{
			printf("当前身份：普通用户");
		}
		else if(usertype == 2)
		{
			printf("当前身份：尊贵的VIP客户"); 
		}
		
		
		
		printf("1.浏览商品\r\n");
		printf("2.加入购物车\r\n");
		printf("3.查看购物车\r\n");
		printf("4.结算\r\n");
		printf("5.清空购物车\r\n");
		printf("6.登录(务必先登录)\r\n");
		printf("7.按类别浏览商品\r\n");
		printf("0.返回\r\n");
		printf("请选择：\r\n");

		
		scanf("%d",&f);
		switch(f)
		{
			case 1:
			showProductsForCustomer();
				break;
			case 2:
				addtocart();
				break;
			case 3:
				showcart();
				break;
			case 4:
				checkout();
				break;
			case 5:
				clearCart();
				break;
			case 6:
				loginuser();
				break;
			case 7:
				showproductbycategory();
				break;
			case 0:
				printf("thanks for using\r\n");
				return;		
			default:
				printf("error\r\n");
			
			
		}
	}
}
void loginuser()
{
	char username[50];
	char password[50];
	
	printf("\n========== 用户登录 ============\n");
	printf("请输入账号:\r\n");
	scanf("%s",username);
	printf("请输入密码:\r\n");
	scanf("%s",password);
	
	if(strcmp(username,"user") == 0 && strcmp(password,"123456") == 0)
	{
		usertype = 1;
		printf("你好，用户\r\n");	
	}
	else if(strcmp(username,"vipuser") == 0 && strcmp(password,"888888") == 0)
	{
		usertype = 2;
		printf("你好，尊贵的VIP\r\n");
	}
	else
	{
		usertype = 0;
		printf("error\r\n");
	}
}
void showProductsForCustomer()
{
    int i;
    int found = 0;

    printf("\n====== 可购买商品 ======\n");

    for(i = 0; i < count; i++)
    {
        if(product[i].stock > 0)
        {
            printf("编号: %d\n", product[i].id);
            printf("名称: %s\n", product[i].name);
            printf("类别: %s\n", product[i].category);
            printf("价格: %.2f\n", product[i].price);
            printf("库存: %d\n", product[i].stock);
            printf("---------------------\n");
            found = 1;
        }
    }

    if(found == 0)
    {
        printf("当前没有可购买商品\r\n");
    }
}
void showproductbycategory()
{
	char category[50];
	int i;
	int found = 0;
	
	printf("请输入要查看的商品类别:");
	scanf("%s",category);
	
	printf("\n========= 类别商品列表 ==========\n");
	
	for(i = 0;i < count;i++)
	{
		if(product[i].stock > 0 && strcmp(product[i].category,category) == 0)
		{
			printf("编号: %d\n", product[i].id);
            printf("名称: %s\n", product[i].name);
            printf("类别: %s\n", product[i].category);
            printf("价格: %.2f\n", product[i].price);
            printf("库存: %d\n", product[i].stock);
            printf("---------------------\n");
            found = 1;
		}
	}
	if(found == 0)
	{
		printf("没有找到该类别商品\r\n");
	}
}
void checkout()
{
	int i;
	int index;
	float total = 0;
	float originaltotal = 0;
	float discount;
	
	
	if(usertype == 0)
	{
		printf("请先登录！\r\n");
		return;
	}
	if(cartcount == 0)
	{
		printf("购物车为空\r\n");
		return;
	}
	
	printf("\n============ 购物小票 ==============\n");
	
	for(i = 0;i < cartcount;i++)
	{	
		float subtotal = cart[i].price * cart[i].quantity;
		index = findproductindexbyid(cart[i].productid);
		if(index != -1)
		{
			product[index].stock -=cart[i].quantity;//保证库存的同步 
		}
		printf("商品：%s\r\n",cart[i].name);
		printf("单价:%.2f 数量：%d 总计:%.2f\r\n",cart[i].price,cart[i].quantity,subtotal);
		printf("--------------------------------\r\n");
		originaltotal += subtotal;
	}
	total = originaltotal;
	if(usertype == 2)
	{	
		discount = originaltotal * 0.1f;
		total = originaltotal - discount; 
		printf("VIP享受9折优惠! 已优惠：%.2f\r\n",discount);
	
	}
	printf("原价：%.2f\r\n",originaltotal);
	printf("实付:%.2f\r\n",total);
	printf("结算成功！欢迎下次光临！\r\n");
	
	
	cartcount = 0;
	saveTofile();
}
void addtocart()
{
	int id,quantity;
	int productindex;
	int i;
	
	showProductsForCustomer(); 
	
	printf("请输入要购买的商品编号：\r\n");
	scanf("%d",&id);
	productindex = findproductindexbyid(id);
	if(productindex == -1)
	{
		printf("error\r\n");
		return;
	}
	
	printf("请输入购买数量:\r\n");
	scanf("%d",&quantity);
	
	if(quantity <= 0)
	{
		printf("error\r\n");
		return;
	}
	if(quantity > product[productindex].stock)
	{
		printf("存货不足\r\n");
		return;
	}

	for(i = 0;i < cartcount;i++)
	{
		if(cart[i].productid == id)
		{
			if(cart[i].quantity + quantity > product[productindex].stock)
			{
				printf("累计数量超过库存\r\n");
				return;
			}
			cart[i].quantity += quantity;
			printf("已更新购物车，当前 %s 的数量为 %d\r\n",cart[i].name,cart[i].quantity);
			return;
		}
	}
	cart[cartcount].productid = product[productindex].id;
	strcpy(cart[cartcount].name,product[productindex].name);
	cart[cartcount].price = product[productindex].price;
	cart[cartcount].quantity = quantity;
	cartcount++;
	
	printf("商品已加入购物车\r\n");
}
int findproductindexbyid(int id)
{
	int i;
	for(i = 0;i < count;i++)
	{
		if(product[i].id == id)
		{
			return i;
		}
	}
	return -1;
}
void showcart()
{
	int i;
	float total = 0; 

	
	if(cartcount == 0)
	{
		printf("购物车为空\r\n");
		return;
	}
	printf("\n========购物车=========\n");
	
	for(i = 0;i < cartcount;i++)
	{
		float subtotal = cart[i].price*cart[i].quantity;
		
		printf("商品编号：%d\r\n",cart[i].productid);
		printf("商品名称：%s\r\n",cart[i].name);
		printf("单价：%.2f\r\n",cart[i].price);
		printf("数量：%d\r\n",cart[i].quantity);
		printf("总计：%.2f\r\n",subtotal);
		printf("----------------------\r\n");
		
		total += subtotal;
	}
	printf("总价：%.2f\r\n",total);
}
void clearCart()
{	
	
    cartcount = 0;
    printf("购物车已清空\r\n");
}
void attendant()
{
	int choice;
	while(1)
	{
		showmenu();
		printf("请输入选择：");
		scanf("%d",&choice);
		switch(choice)
		{
			case 1:
				addproduct();
				break;
			case 2:
				showall();
				break;
			case 3:
				deleteProduct();
				break;
			case 4:
				updateproduct();
				break;
			case 5:
				findproduct();
				break;
			case 6:
				saveTofile();
				break;
			case 7:
				loadfromfile();
				break;
			case 0:
				saveTofile();
				printf("thanks for using\r\n");
				printf("\n============超市系统===============\n");
				printf("1.管理员系统\r\n");
				printf("2.用户端\r\n");
				printf("0.退出\r\n");
				printf("请选择：\r\n");
				return;
			default:
				printf("error\r\n");	
		}
		}		
}
void showmenu()
{
	printf("\n=============超市管理系统==============\n");
	printf("1.addproduct\r\n");
	printf("2.showall\r\n");
	printf("3.deleteProduct\r\n");
	printf("4.update\r\n");
	printf("5.findproduct\r\n");
	printf("6.saveTofile\r\n");
	printf("7.loadfromfile\r\n");
	printf("0.exit\r\n");
	printf("=========================================\n");
}
void addproduct()
{
	printf("\n------添加商品------\n");
	printf("输入商品名称\r\n");
	scanf("%s",product[count].name);
	printf("请输入商品生产日期：");
	scanf("%d %d %d",&product[count].produceDate.year,&product[count].produceDate.mouth,&product[count].produceDate.day);
	printf("输入价格：");
	scanf("%f",&product[count].price);
	printf("输入库存：");
	scanf("%d",&product[count].stock);
	printf("请输入商品种类:");
	scanf("%s",product[count].category);
	
	product[count].id = count + 1;
	count++;
	 
	printf("添加成功");
		
}
void showall()
{
	if(count == 0)
	{
		printf("error");
		return;
	}
	printf("\n%-5s %-15s %-15s %-10s %-10s\n %-15s\n","编号","名称","类别","价格","库存","生产日期");
	printf("--------------------------------------------\n");
	int n;
	for(n = 0;n < count;n++)
	{
		printf("\n%-5d %-15s %-15s %-10.2f %-10d %04d-%02d-%02d\n",product[n].id,product[n].name,product[n].category,product[n].price,product[n].stock,product[n].produceDate.year,product[n].produceDate.mouth,product[n].produceDate.day);
		
		
	 } 
	
	
	
	
	
}
void deleteProduct()
{
	int id;
	int index = -1;//默认没找到
	int i;
	printf("请输入要删除的商品编号:");
	scanf("%d",&id);
	//变量区 
	for(i = 0;i < count;i++)
	{
		if(product[i].id == id)
		{
			index = i;
			break;
		}
	}
	//查找区
	if(index == -1)
	{
		
		printf("error\r\n");
		return ;
	}
	for(i = index;i < count - 1;i++)
	{
		product[i] = product[i+1];
		
		
	}
	count--;
	printf("删除 %s 成功\r\n",product[index].name);}
void updateproduct()
{
	int id;
	int index;
	
	printf("请输入修改商品的编号：");
	scanf("%d",&id);
	
	index = -1;
	int i;
	for(i = 0;i < count;i++)
	{
		if(product[i].id == id)
		{
			index = i;
			break;
		}
	
		}
	if(index == -1)
		{
			printf("error\r\n");
			return;
		
	 } 
	printf("请输入新名称：");
	scanf("%s",product[index].name);
	
	printf("请输入新价格：");
	scanf("%f",&product[index].price);
	
	printf("请输入新库存：");
	scanf("%d",&product[index].stock);
	
	printf("请输入新生产日期：");
	scanf("%d %d %d",&product[index].produceDate.year,&product[index].produceDate.mouth,&product[index].produceDate.day);
	
	 }
	void findproduct()
	{
		int choice;
		printf("1.按编号查找\r\n"); 
		printf("2.按名称查找\r\n");
		printf("请选择：");
		scanf("%d",&choice);
		if(choice == 1)
		{
			
		  
		int id;
		int m;
		int found = 0;
		printf("请输入要查找的编号:");
		scanf("%d",&id);
		for(m = 0;m < count;m++)
		{
			if(product[m].id == id)
			{
				printf("找到商品：\r\n");
				printf("编号:%d\r\n",product[m].id);
				printf("名称:%s\r\n",product[m].name);
				printf("价格:%.2f\r\n",product[m].price);
				printf("库存:%d\r\n",product[m].stock);
				printf("生产日期:%d-%d-%d\r\n",product[m].produceDate.year,product[m].produceDate.mouth,product[m].produceDate.day);
				found = 1;
				break;
				
			}
			
		}
		if(found == 0)
			{
				printf("error\r\n");
				
			}
		}
		else if(choice == 2)
		{
			char name[100];
			int i;
			int found = 0;
			
			printf("请输入查找商品名称：");
			scanf("%s",name);
			
			for(i = 0;i < count;i++)
			{
				if(strcmp(product[i].name,name) == 0)
				{
					printf("找到商品\r\n");
					printf("编号：%d\r\n",product[i].id);
					printf("名称:%s\r\n",product[i].name);
					printf("价格：%.2f\r\n",product[i].price);
					printf("库存：%d\r\n",product[i].stock);
					printf("生产日期：%d-%d-%d\r\n",product[i].produceDate.year,product[i].produceDate.mouth,product[i].produceDate.day);
					found = 1;
				}	
			}
			if(found == 0)
			{
				printf("error\r\n");
			}
		}
		else
		{
			printf("error\r\n");
		}
	}
	void saveTofile()
	{
		FILE *fp;
		fp = fopen(DATA_FILE,"wb");
		if(fp == NULL)
		{
			printf("error\r\n");
			return;
		}
		fwrite(&count,sizeof(int),1,fp);
	
		fwrite(&product,sizeof(struct product),count,fp);
		
		fclose(fp);
		printf("saved as FILE %s\r\n",DATA_FILE);
		
	}
	void loadfromfile()
	{
		FILE *fp;
		fp = fopen(DATA_FILE,"rb");
		if (fp == NULL)
		{
			printf("未找到数据文件，从空数据开始\r\n");
			count = 0;
		
			return;
		}
		
		fread(&count,sizeof(int),1,fp);
	
		fread(&product,sizeof(struct product),count,fp);
		
		fclose(fp);
		printf("已从文件 %s 中读取数据，共 %d 条记录\r\n",DATA_FILE,count);
		
	
	}

