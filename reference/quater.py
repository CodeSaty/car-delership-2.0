import pandas as pd
import matplotlib.pyplot as plt

# Main Menu
while True:
    print("\nMain Menu")
    print("1. Fetch data")
    print("2. Dataframe Statistics")
    print("3. Display Records")
    print("4. Working on Records")
    print("5. Working on Columns")
    print("6. Search specific row/column")
    print("7. Data Visualization")
    print("8. Data Analytics")
    print("9. Exit")
    
    ch = int(input("Enter your choice: "))
    
    if ch == 1:
        sales = pd.read_csv("car_sales.csv", index_col=0)
        print("Car sales data loaded successfully!")
    
    elif ch == 2:
        while True:
            print("\nDataframe Statistics Menu")
            print("1. Display the Transpose")
            print("2. Display all column names")
            print("3. Display the indexes")
            print("4. Display the shape")
            print("5. Display the dimension")
            print("6. Display the data types of all columns")
            print("7. Display the size")
            print("8. Exit")
            ch2 = int(input("Enter choice: "))
            
            if ch2 == 1:
                print(sales.T)
            elif ch2 == 2:
                print(sales.columns)
            elif ch2 == 3:
                print(sales.index)
            elif ch2 == 4:
                print(sales.shape)
            elif ch2 == 5:
                print(sales.ndim)
            elif ch2 == 6:
                print(sales.dtypes)
            elif ch2 == 7:
                print(sales.size)
            elif ch2 == 8:
                break
    
    elif ch == 3:
        while True:
            print("\nDisplay Records Menu")
            print("1. Top 5 Records")
            print("2. Bottom 5 Records")
            print("3. Specific number of records from the top")
            print("4. Specific number of records from the bottom")
            print("5. Details of a specific Quarter")
            print("6. Display details of all Quarters")
            print("7. Exit")
            ch3 = int(input("Enter choice: "))
            
            if ch3 == 1:
                print(sales.head())
            elif ch3 == 2:
                print(sales.tail())
            elif ch3 == 3:
                n = int(input("Enter how many records you want to display from the top: "))
                print(sales.head(n))
            elif ch3 == 4:
                n = int(input("Enter how many records you want to display from the bottom: "))
                print(sales.tail(n))
            elif ch3 == 5:
                quarter = input("Enter the quarter (e.g., Q1, Q2): ")
                print(sales.loc[quarter])
            elif ch3 == 6:
                print(sales)
            elif ch3 == 7:
                break
    
    elif ch == 4:
        while True:
            print("\nWorking on Records Menu")
            print("1. Insert a specific Quarter's Details")
            print("2. Delete a specific Quarter's Details")
            print("3. Update a specific Quarter's Details")
            print("4. Exit")
            ch4 = int(input("Enter choice: "))
            
            if ch4 == 1:
                quarter = input("Enter Quarter (e.g., Q1, Q2): ")
                units_sold = int(input("Enter Units Sold: "))
                revenue = float(input("Enter Revenue ($): "))
                avg_price = revenue / units_sold if units_sold > 0 else 0
                sales.loc[quarter] = [units_sold, revenue, avg_price]
                print("Data successfully inserted.")
            elif ch4 == 2:
                quarter = input("Enter Quarter to delete: ")
                sales.drop([quarter], inplace=True)
                print("Data successfully deleted.")
            elif ch4 == 3:
                quarter = input("Enter Quarter to update: ")
                units_sold = int(input("Enter Units Sold: "))
                revenue = float(input("Enter Revenue ($): "))
                avg_price = revenue / units_sold if units_sold > 0 else 0
                sales.loc[quarter] = [units_sold, revenue, avg_price]
                print("Data successfully updated.")
            elif ch4 == 4:
                break
    
    elif ch == 5:
        while True:
            print("\nWorking on Columns Menu")
            print("1. Insert a new column data")
            print("2. Delete a specific column")
            print("3. Exit")
            ch5 = int(input("Enter choice: "))
            
            if ch5 == 1:
                column_name = input("Enter column name: ")
                data = eval(input(f"Enter details for the column {column_name} (as a list): "))
                sales[column_name] = pd.Series(data, index=sales.index)
                print("Column inserted.")
            elif ch5 == 2:
                column_name = input("Enter column name to delete: ")
                sales.drop([column_name], axis=1, inplace=True)
                print("Column deleted.")
            elif ch5 == 3:
                break
    
    elif ch == 6:
        while True:
            print("\nSearch Menu")
            print("1. Search for details of a specific Quarter")
            print("2. Search details for a specific column")
            print("3. Exit")
            ch6 = int(input("Enter choice: "))
            
            if ch6 == 1:
                quarter = input("Enter the quarter to search (e.g., Q1, Q2): ")
                print(sales.loc[quarter])
            elif ch6 == 2:
                column_name = input("Enter column name to search: ")
                print(sales[column_name])
            elif ch6 == 3:
                break
    
    elif ch == 7:
        while True:
            print("\nData Visualization Menu")
            print("1. Line Plot")
            print("2. Vertical Bar Plot")
            print("3. Horizontal Bar Plot")
            print("4. Histogram")
            print("5. Exit")
            ch7 = int(input("Enter choice: "))
            
            if ch7 == 1:
                plt.plot(sales.index, sales["Units Sold"], label="Units Sold", marker='o')
                plt.title("Units Sold per Quarter")
                plt.xlabel("Quarter")
                plt.ylabel("Units Sold")
                plt.legend()
                plt.grid(True)
                plt.show()
            elif ch7 == 2:
                sales["Units Sold"].plot(kind="bar", title="Quarterly Units Sold", legend=True)
                plt.show()
            elif ch7 == 3:
                sales["Units Sold"].plot(kind="barh", title="Quarterly Units Sold", legend=True)
                plt.show()
            elif ch7 == 4:
                sales["Units Sold"].plot(kind="hist", bins=5, title="Distribution of Units Sold", legend=True)
                plt.show()
            elif ch7 == 5:
                break
    
    elif ch == 8:
        while True:
            print("\nData Analytics Menu")
            print("1. Quarter with maximum sales")
            print("2. Quarter with minimum sales")
            print("3. Exit")
            ch8 = int(input("Enter choice: "))
            
            if ch8 == 1:
                max_sales = sales["Units Sold"].max()
                quarter = sales.loc[sales["Units Sold"] == max_sales].index[0]
                print(f"Quarter with maximum sales ({max_sales} units): {quarter}")
            elif ch8 == 2:
                min_sales = sales["Units Sold"].min()
                quarter = sales.loc[sales["Units Sold"] == min_sales].index[0]
                print(f"Quarter with minimum sales ({min_sales} units): {quarter}")
            elif ch8 == 3:
                break
    
    elif ch == 9:
        break
