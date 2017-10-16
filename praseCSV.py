#!/usr/bin/python3
# -*- coding: utf-8 -*-
'''
parse csv of Codes for the administrative
divisions of the People's Republic of China
(GB/T2260)
'''
import re
import json

# def join(base, *paths):
#     ''' join file path, '''
#     return os.path.normpath(os.path.join(base, *paths)).replace('\\', '/')

def parseCSV(fp):
    provinces = dict()
    citys= dict()
    districts = dict()

    for line in fp:
        res = re.match(r'^(\d\d)(\d\d)(\d\d),(.+)$', line)
        if res != None:
            (province, city, district, name) = res.groups()
            # province
            if city == '00' and district == '00':
                provinces[province] = name
            #city
            elif district == '00':
                citys[province + city] = name
            #district
            else:
                citys.pop(city, None)
                districts[province + city + district] = name

    return provinces, citys, districts

if __name__ == '__main__':
    with open('./data/data.csv', 'r', encoding='utf-8') as fp:
        provinces, citys, districts = parseCSV(fp)

    # concat province & citys and filter independent province code
    for (code, name_city) in citys.items():
        (code_province, code_city) = re.match(r'^(\d{2})(\d{2})$', code).groups()
        # Mark province name by adding a @ on their head
        name_province = provinces[code_province]
        if re.fullmatch('@.+', name_province):
            name_province = name_province[1:]
        else:
            provinces[code_province] = '@' + name_province

        if name_city in ['市辖区', '省直辖县级行政区划', '自治区直辖县级行政区划']:
            citys[code] = name_province + ' '
        else:
            citys[code] = name_province + ' ' + name_city

    # concat citys & districts and filter independent city code
    for (code, name_district) in districts.items():
        (province, city, district) = re.match(r'^(\d{2})(\d{2})(\d{2})$', code).groups()
        # Mark city name by adding a @ on their head
        name_city = citys[province + city]
        if re.fullmatch('@.+', name_city):
            name_city = name_city[1:]
        else:
            citys[province + city] = '@' + name_city

        districts[code] = name_city + ' ' + name_district

    with open('./data/data.json', 'w', encoding='utf-8') as out:
        result = districts
        for (code, name) in provinces.items():
            if not re.fullmatch(r'@.+', name):
                result[code + '0000'] = name
        for (code, name) in citys.items():
            if not re.fullmatch(r'@.+', name):
                result[code + '00'] = name
        json.dump(result, out, ensure_ascii=False)
    # create index
    # index = dict()
    # max_len_index = 0
    # for (code, name_province) in provinces.items():
    #     if not re.fullmatch(r'@.+', name_province):
    #         index[code + '00'] = name_province + '@-1'

    # for (code, name_city) in citys.items():
    #     if re.fullmatch(r'@.+', name_city):
    #         name_city = name_city[1:]

    #     index[code] = name_city + '@-1'

    #     if len(name_city.encode(encoding='utf-8')) > max_len_index:
    #         max_len_index = len(name_city.encode(encoding='utf-8'))
    # print('max length of index: %d' % (max_len_index))

    # #create fullNames
    # data = sorted(districts.items())
    # max_len_data = 0
    # curr_key_index = ''

    # fullNames = []

    # for i in range(len(data)):
    #     (code, name_district) = data[i]
    #     (code_index, code_district) = re.match(r'^(\d{4})(\d\d)$', code).groups()
    #     # record offset when code_index changes
    #     if code_index != curr_key_index:
    #         curr_key_index = code_index
    #         index[code_index] = re.sub(r'@-?\d+', '@' + str(i), index[code_index])

    #     fullNames.append((code_district, name_district))
    #     if len(name_district.encode(encoding='utf-8')) > max_len_data:
    #         max_len_data = len(name_district.encode(encoding='utf-8'))

    # print('max length of fullNames: %d' % (max_len_data))

    # with open('./dest/index.json', 'w', encoding='utf-8') as out:
    #     pos = 0
    #     data = {'chunkSize': max_len_data + 1}
    #     for (code, name) in index.items():
    #         (name, offset) = re.fullmatch(r'(.+)@(-?\d+)', name).groups()
    #         data[code] = {'name': name, 'index': int(offset), 'length': 0}
    #     json.dump(data, out, ensure_ascii=False)

    # with open('./dest/districts.dat', 'wb') as out:
    #     # DO NOT SORT HERE !!!
    #     for (code, name) in fullNames:
    #         code = int(code).to_bytes(1, 'big')
    #         name = name.encode(encoding='utf-8')
    #         out.write(code + name + bytes(max_len_data - len(name)))
    # # fullNames = [(key ,fullNames[key]) for key in sorted(fullNames.keys())]
    # # with open('./fullNames.json', 'w', encoding='utf-8') as out:
    # #     json.dump(fullNames, out, ensure_ascii=False)
