
import pandas as pd
import plotly
import plotly.express as px
import json


def Analyse(df):
    df["Quantity_Ordered"] = df["Quantity_Ordered"].astype("float")
    df["Price_Each"] = df["Price_Each"].astype("float")
    df["Order_ID"] = df["Order_ID"].astype("int")
    MonthWise, month_explanation = Find_MonthWise(df)
    
    ProductWise, product_explanation = Find_ProductWise(df)
    
    CityWise, city_explanation = Find_CityWise(df)
    
    TimeWise, time_explanation = Find_TimeWise(df)
    
    Forecast, forecast_explanation = Sales_Forecast(df)
    
    Final = {
        'Month': {'graph': MonthWise, 'explanation': month_explanation},
        'Product': {'graph': ProductWise, 'explanation': product_explanation},
        'City': {'graph': CityWise, 'explanation': city_explanation},
        'Time': {'graph': TimeWise, 'explanation': time_explanation},
        'Forecast': {'graph': Forecast, 'explanation': forecast_explanation}
    }
    return Final


def Find_TimeWise(df):
    list_time = []

    for i in df['Order_Date']:
        list_time.append(i.split(" ")[1])  # separating date and time component
    df['Time'] = list_time

    df_Time = df.groupby(['Time'])['Total_Price'].sum().reset_index()
    df_Time_top10 = df_Time.sort_values('Total_Price', ascending=False).head(10)

    fig = px.bar(df_Time_top10, x='Time', y='Total_Price',
                 title='Top 10 Time Slots by Sales',
                 labels={'Time': 'Time of Day', 'Total_Price': 'Total Sales ($)'},
                 text='Total_Price')
    fig.update_traces(texttemplate='%{text:.2s}', textposition='outside')
    fig.update_layout(uniformtext_minsize=8, uniformtext_mode='hide')

    graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = "This bar chart shows the top 10 time slots with the highest sales. It helps identify peak sales hours."

    return graph_json, explanation


def Find_MonthWise(df):
    df["Total_Price"] = df["Quantity_Ordered"] * df["Price_Each"]

    df_Total_Price = df.groupby(['month'])['Total_Price'].sum().reset_index()

    month_order = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"]
    df_Total_Price['month'] = pd.Categorical(df_Total_Price['month'], categories=month_order, ordered=True)
    df_Total_Price = df_Total_Price.sort_values('month')

    fig = px.bar(df_Total_Price, x='month', y='Total_Price', title='Month wise Sales',
                 labels={'month': 'Month', 'Total_Price': 'Total Sales ($)'},
                 text='Total_Price')
    fig.update_traces(texttemplate='%{text:.2s}', textposition='outside')
    fig.update_layout(uniformtext_minsize=8, uniformtext_mode='hide')

    graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = "This bar chart shows total sales for each month. It helps identify the best and worst performing months."

    return graph_json, explanation
# 2nd Question

def Find_CityWise(df):
    list_city = []
    for i in df['Purchase_Address']:
        list_city.append(i.split(",")[1].strip())
    df['City'] = list_city

    df_City = df.groupby(["City"])['Total_Price'].sum().reset_index()

    fig = px.bar(df_City.sort_values('Total_Price', ascending=False), x='City', y='Total_Price',
                 title='City wise Sales',
                 labels={'City': 'City', 'Total_Price': 'Total Sales ($)'},
                 text='Total_Price')
    fig.update_traces(texttemplate='%{text:.2s}', textposition='outside')
    fig.update_layout(uniformtext_minsize=8, uniformtext_mode='hide')

    graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = "This bar chart shows total sales for each city. It helps identify the cities with the highest sales."

    return graph_json, explanation
    
    
    
    
    
# 3rd Question

def Find_ProductWise(df):
    df_Product = df.groupby(['Product'])['Quantity_Ordered'].sum().reset_index()
    df_Product = df_Product.rename(columns={'Quantity_Ordered': 'Total_Quantity'})

    fig = px.bar(df_Product.sort_values('Total_Quantity', ascending=False), x='Product', y='Total_Quantity',
                 title='Product and Total Quantity Sold',
                 labels={'Product': 'Product', 'Total_Quantity': 'Total Quantity Sold'},
                 text='Total_Quantity')
    fig.update_traces(texttemplate='%{text:.2s}', textposition='outside')
    fig.update_layout(uniformtext_minsize=8, uniformtext_mode='hide')

    graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = "This bar chart shows the total quantity sold for each product. It helps identify the best-selling products."

    return graph_json, explanation

#  4th Question


from prophet import Prophet

def Sales_Forecast(df):
    # Prepare data for Prophet: aggregate monthly sales
    df["Total_Price"] = df["Quantity_Ordered"] * df["Price_Each"]
    df_monthly = df.groupby('month')['Total_Price'].sum().reset_index()

    # Map month names to numbers for sorting and forecasting
    month_map = {"jan":1, "feb":2, "mar":3, "apr":4, "may":5, "june":6, "july":7, "aug":8, "sep":9, "oct":10, "nov":11, "dec":12}
    df_monthly['month_num'] = df_monthly['month'].map(month_map)
    df_monthly = df_monthly.dropna(subset=['month_num'])
    df_monthly = df_monthly.sort_values('month_num')

    # Create dataframe for Prophet with ds and y columns
    # Use first day of each month as date
    df_monthly['ds'] = pd.to_datetime(df_monthly['month_num'].astype(int).astype(str) + '-01-2023', format='%m-%d-%Y')
    df_monthly['y'] = df_monthly['Total_Price']

    model = Prophet(yearly_seasonality=True, daily_seasonality=False, weekly_seasonality=False)
    model.fit(df_monthly[['ds', 'y']])

    future = model.make_future_dataframe(periods=6, freq='M')  # forecast next 6 months
    forecast = model.predict(future)

    # Prepare forecast plot
    fig = px.line(forecast, x='ds', y='yhat', title='Sales Forecast for Next 6 Months',
                  labels={'ds': 'Date', 'yhat': 'Predicted Sales ($)'})
    graph_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)

    explanation = "This line chart shows the forecasted sales for the next 6 months based on historical data."

    return graph_json, explanation
