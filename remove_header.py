import os

entries = os.listdir("Test/")

print(entries)

#try:
for entry in entries:
    print(entry)
    print("bruh")
    with open("Test/" + entry, 'r+') as f:
        lines = f.readlines()
        print(lines,"\n")
        print(lines[1:],"\n")
        f.writelines(lines[1:])
        print(f.readlines(),"\n")
print("success!")
#except:
#    print("error!")
                    

