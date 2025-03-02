
import io
import base64
from matplotlib.backends.backend_agg import FigureCanvasAgg
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


# df = pd.read_csv("Filtered_DataSet")




def Analyse(df):
    df["Quantity_Ordered"] = df["Quantity_Ordered"].astype("float")
    df["Price_Each"] = df["Price_Each"].astype("float")
    df["Order_ID"] = df["Order_ID"].astype("int")
    MonthWise = Find_MonthWise(df)
    
    ProductWise = Find_ProductWise(df)
    
    CityWise = Find_CityWise(df)
    
    TimeWise = Find_TimeWise(df)
    
    Final = {'Month':MonthWise,'Product':ProductWise,'City':CityWise,'Time':TimeWise}
    return Final


def Find_MonthWise(df):
    df["Total_Price"] = df["Quantity_Ordered"] * df["Price_Each"]

    df_Total_Price = df.groupby(['month'])['Total_Price'].sum().sort_values(ascending=False)
    df_Total_Price = df_Total_Price.to_frame()

    df_Total_Price = df_Total_Price.reset_index()


    month_order = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"]
    df_Total_Price['month'] = pd.Categorical(df_Total_Price['month'], categories=month_order, ordered=True)
    df_Total_Price = df_Total_Price.sort_values('month')
    df_Total_Price = df_Total_Price.reset_index(drop=True)

    a4_dims = (11.7, 8.27)
    fig, ax = plt.subplots(figsize=a4_dims)

    sns.barplot(x = "Total_Price",
                y = "month",
                data =df_Total_Price )
    plt.title("Month wise Sale")
    canvas = FigureCanvasAgg(fig)
    buf = io.BytesIO()
    canvas.print_png(buf)
    plt.close(fig)
    buf.seek(0)

    # Convert the image to a base64-encoded string
    image_Month= base64.b64encode(buf.read()).decode("utf-8")
    return image_Month
# 2nd Question

def Find_CityWise(df):
    list_city = []
    for i in df['Purchase_Address']:
        list_city.append(i.split(",")[1])
    df['City'] = list_city

    df_City=df.groupby(["City"])['Total_Price'].sum().sort_values(ascending=False)
    df_City=df_City.to_frame()
    df_City.reset_index(inplace=True)


    a4_dims = (11.7, 8.27)
    fig, ax = plt.subplots(figsize=a4_dims)
    sns.barplot(x = "Total_Price",
                y = "City",
                data = df_City)
    plt.title("City wise Sales")
    canvas = FigureCanvasAgg(fig)
    buf = io.BytesIO()
    canvas.print_png(buf)
    plt.close(fig)
    buf.seek(0)

    # Convert the image to a base64-encoded string
    image_City = base64.b64encode(buf.read()).decode("utf-8")
    return image_City
    
    
    
    
    
# 3rd Question

def Find_ProductWise(df):

    df_Product=df.groupby(['Product'])['Quantity_Ordered'].sum().sort_values(ascending=False)
    df_Product=df_Product.to_frame()
    df_Product = df_Product.reset_index().rename(columns={'Quantity_Ordered': 'Total_Quantity'})

    a4_dims = (11.7, 8.27)
    fig, ax = plt.subplots(figsize=a4_dims)
    sns.barplot(x = "Total_Quantity",
                y = "Product",
                data = df_Product)
    plt.title("Prouct and Total_Quantity")

    canvas = FigureCanvasAgg(fig)
    buf = io.BytesIO()
    canvas.print_png(buf)
    plt.close(fig)
    buf.seek(0)

    # Convert the image to a base64-encoded string
    image_Product = base64.b64encode(buf.read()).decode("utf-8")
    return image_Product

#  4th Question


def Find_TimeWise(df):
    list_time = []

    for i in df['Order_Date']:
        list_time.append(i.split(" ")[1]) #seperating date and time component
    df['Time'] = list_time

    df_Time=df.groupby(['Time'])['Total_Price'].sum().sort_values(ascending=False)
    df_Time=df_Time.to_frame()
    df_Time = df_Time.reset_index()

    df_Time_top10 = df_Time.head(10)


    a4_dims = (11.7, 8.27)
    fig, ax = plt.subplots(figsize=a4_dims)
    sns.barplot(x = "Total_Price",
                y = "Time",
                data = df_Time_top10)
    plt.title("Time vs Sales")

    canvas = FigureCanvasAgg(fig)
    buf = io.BytesIO()
    canvas.print_png(buf)
    plt.close(fig)
    buf.seek(0)

    # Convert the image to a base64-encoded string
    image_Time = base64.b64encode(buf.read()).decode("utf-8")
    return image_Time
